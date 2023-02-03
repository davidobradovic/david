const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();

app.use(cors())
app.use(bodyParser.json());

const sql = require("mssql/msnodesqlv8");

const config = {
    user: "davidsql",
    password: "david123#",
    server: "dcsarajevo.ddns.net\\SRV04,5001",
    database: "Client004",
    driver: "msnodesqlv8",
      options: {
        trustServerCertificate: false, // change to true for local dev / self-signed certs
        trustedConnection: false
    }
}

app.get('/', (req, res) => {
    res.send("Idemo")
})

app.get('/getdata', (req, res) => {
    
        sql.connect(config, async function(err){
            if(err)console.log(err);
            const request = new sql.Request();

            await request.query(`SELECT r.anQid as 'Sifra kupca', g.acKey as 'Broj racuna', n.acNote as 'OBJEKAT', 
            g.acDoc2 as 'Broj fiskalnog racuna', g.acDocType as Konto, g.acIssuer as 'Skladiste', 
             convert(varchar(MAX), g.adDate, 104)  as 'Datum Racuna', r.acNote as 'Segmentacija kupca', r.acName2 as 'Naziv kupca', 
            r.acAddress as 'Adresa kupca', r.acPost as 'Postanski broj', r.acCity as 'Grad', r.acName3 as 'Regija',
            r.acRegNo as 'JIB', PM.acName as 'Nacin placanja', od.acName as 'Ime odg. osobe', od.acSurname as 'Prezime odg. osobe' , 
            de.acName as 'Nacin dostave', (rf.acName + rf.acSurname) as 'Referent na kasi', isnull(m.acFieldSI,0) as 'Tip Proizvoda', 
            isnull(m.acFieldSC,0) as Kategorija, isnull(M.acFieldSD,0) as 'Podkategorija', isnull(M.acFieldSF,0) as 'Grupa', 
            isnull(M.acFieldSG,0) as 'Podgrupa', isnull(M.acFieldSH,0) as 'Model', m.acIdent as 'Sifra artikla',
            m.acName as 'Naziv artikla', ltrim(replace(str(p.anQty,10,2),'.',',')) as 'Kolicina', ltrim(replace(str(p.anStockPrice,10,2),'.',',')) as 'Nabavna cijena komada',  
            ltrim(replace(str((p.anQty * p.anStockPrice),10,2),'.',',')) as 'Nabavna vrijednost', ltrim(replace(str(p.anRTPrice,10,2),'.',',')) as 'Prodajna cijena komada bez pdv-a',
            ltrim(replace(str(p.anRetailPrice,10,2),'.',',')) as 'Prodajna cijena komada sa PDV-om',  ltrim(replace(str(p.anPVOCVATBase,10,2),'.',',')) as 'Vrijednost bez pdv-a',
            ltrim(replace(str(p.anPVVAT,10,2),'.',',')) as 'Vrijednost PDV-a', ltrim(replace(str(p.anPVOCforPay,10,2),'.',',')) as 'Vrijednost sa PDV-om',
            ltrim(replace(str(p.anRebate1,10,2),'.',',')) as 'Rabat %' ,ltrim(replace(str(p.anPVOCDiscount,10,2),'.',',')) as 'Popust', 
            ltrim(replace(str((p.anPVOCVATBase -(p.anQty * isnull(p.anStockPrice,0))),10,2),'.',',')) as 'RUC'
            from tHE_Move g
            inner join tHE_MoveItem p on g.ackey = p.acKey
            inner join tHE_SetItem m on p.acIdent = m.acIdent
            left join vHE_SetSubj r on g.acReceiver = r.acSubject
            left join tPA_SetDocType n on g.acDocType = n.acDocType
            LEFT JOIN vHE_SetPayMet PM ON G.acPayMethod = PM.acPayMethod
            left join _oosobe OD on g.anClerk = OD.anClerk
            left join _oosobe rf on rf.anClerk = g.anNoteClerk
            LEFT JOIN vHE_SetDelMet de ON g.acDelivery  =  de.acDelivery
            where  YEAR(g.adDate) = YEAR(GetDate())
            AND G.acDocType in ('3000','3003','3004','3005','3006','3007','3201','3202','3207','3210','3223','3601','3651','3652','3653','3654','3655','3200','3208','3209')`, function(err, records){
                if(err)console.log(err)
            else res.status(200).send(records.recordset)
        })
    })

})

app.get('/idemo', (req, res) => {
    res.send('Idemo jakoob')
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server pokrenut na portu ${port} `)
})

