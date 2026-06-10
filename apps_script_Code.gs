/****************************************************************
 * CRESI AgroecologIA — collecteur de réponses (Google Sheet)
 * À coller dans : ton Google Sheet → Extensions → Apps Script.
 * Puis Déployer → Nouveau déploiement → type "Application Web" :
 *   - Exécuter en tant que : Moi (naudin@cirad.fr)
 *   - Qui a accès : Tout le monde
 * Copie l'URL /exec obtenue et colle-la dans config.js (ENDPOINT).
 ****************************************************************/
var SHEET_ID = "1LYpuxbD0jMTGQZCaj4q-Dt1PT6dN3affNYllFHcf11s";
var CRIT = ["Pertinence","Clarté","Actionnabilité","Confiance","Longueur"];

function doPost(e){
  try{
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var rep = sheet_(ss,"reponses", repHeader_());
    var nug = sheet_(ss,"nuggets", ["horodatage","evaluateur","atelier","question","nugget_id","choix"]);
    var p = data.profil || {};
    (data.questions||[]).forEach(function(q){
      var row = [data.horodatage, data.evaluateur, data.atelier,
        p.p_code,p.p_sexe,p.p_date,p.p_lieu,p.p_struct,p.p_spe,p.p_exp,p.p_dip,p.p_fam,p.p_agent,p.p_agent_autre,p.p_conf,p.p_conf_raison,
        q.qid, q.connaissance, q.systeme_A];
      CRIT.forEach(function(c){ row.push((q.qualite_A||{})[c]||""); });
      row.push(q.systeme_B);
      CRIT.forEach(function(c){ row.push((q.qualite_B||{})[c]||""); });
      var adds=(q.ajouts_libres||[]).map(function(a){return a.niveau+": "+a.texte;}).join(" | ");
      row.push(adds);
      rep.appendRow(row);
      var ng=q.nuggets||{};
      Object.keys(ng).forEach(function(nid){
        nug.appendRow([data.horodatage, data.evaluateur, data.atelier, q.qid, nid, ng[nid]]);
      });
    });
    return out_({ok:true});
  }catch(err){
    return out_({ok:false, error:String(err)});
  }
}
function repHeader_(){
  var h=["horodatage","evaluateur","atelier","code","sexe","date","lieu","structure","specialite",
    "experience","diplome","familiarite_IA","agent_IA","agent_autre","confiance_IA","confiance_raison",
    "question","connaissance","systeme_A"];
  CRIT.forEach(function(c){h.push("A_"+c);});
  h.push("systeme_B");
  CRIT.forEach(function(c){h.push("B_"+c);});
  h.push("ajouts_libres");
  return h;
}
function sheet_(ss,name,header){
  var sh=ss.getSheetByName(name);
  if(!sh){ sh=ss.insertSheet(name); sh.appendRow(header); }
  else if(sh.getLastRow()===0){ sh.appendRow(header); }
  return sh;
}
function out_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function doGet(){ return out_({ok:true, msg:"collecteur AgroecologIA actif"}); }
