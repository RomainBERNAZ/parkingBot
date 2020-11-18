
var Twit = require('twit')
const fetch = require("node-fetch");

var T = new Twit({
  consumer_key:         'lg3s8ARxuMzbG2c6m2cIA8k0p',
  consumer_secret:      '3rmrNrSCpxdyiiYdjBEfkw8X9ek12SNp7hW3VDGKYorcnGYNY1',
  access_token:         '1328331889300664320-dIe5Gx6aLsBvTkhpjuEI98vlfInn2n',
  access_token_secret:  'dnw9BAzkk3HRlbU4RF3VXbRrSi7ejTRjAM8KqACpsvMBR',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

var info, tab, totalDispo, total;

async function test() {
  
  const url= 'https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_parkings-publics-nantes-disponibilites&q=&rows=28&facet=grp_nom&facet=grp_statut';
  var somme= [];
  var sommeTotal=[];

  await fetch(url, {
    mode:'cors'
  })
  .then(response => response.json())
  .then(function(data){
    info = data;
    tab = info.records;
    console.log(tab)
    //On récupère le nombre de places dispo dans chaque parking et on calcule la somme ensuite
    tab.map(child => somme.push(child.fields.grp_disponible))
    totalDispo = somme.reduce((a,b) => a + b, 0);
    //On récupère le nombre de places totales dans chaque parking et on calcule la somme ensuite
    tab.map(child => sommeTotal.push(child.fields.grp_exploitation))
    total = sommeTotal.reduce((a,b) => a + b, 0);

    console.log(totalDispo, total)
  } );
}

async function postTwit() {
  await test();
  T.post('statuses/update', { status: "Il y a actuellement "+ totalDispo + " places de parking disponibles à Nantes sur un total de "+total+". Soit un taux d'occupation de "+ Math.round((totalDispo/total)*100)+ "%."}, function(err, data, response) {
    console.log(data)
  })

}
test();
postTwit();

