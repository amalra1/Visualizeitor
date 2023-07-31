var xmlhttp; 
var xmlStr;

// Structure for subject data
class SubjectData 
{
  constructor(subjectCode, subjectName, situation, finalGrade, year, semester, frequency) 
  {
    this.subjectCode = subjectCode;
    this.subjectName = subjectName;
    this.situation = situation;
    this.finalGrade = finalGrade;
    this.year = year;
    this.semester = semester;
    this.frequency = frequency;
  }
}

var subjectCodes = [
  'CI069', 'CI084', 'CI085', 'CI086', 'CI087', 'CI088', 'CI089', 'CI090',
  'CI091', 'CI092', 'CI093', 'CI094', 'CI095', 'CI097', 'CI167', 'CI168',
  'CI169', 'CI170', 'CI171', 'CI172', 'CI173', 'CI174', 'CI204', 'CI205',
  'CI214', 'CI301', 'CI302', 'CI303', 'CI304', 'CI305', 'CI306', 'CI309',
  'CI310', 'CI311', 'CI312', 'CI313', 'CI314', 'CI315', 'CI316', 'CI317',
  'CI318', 'CI320', 'CI321', 'CI337', 'CI338', 'CI339', 'CI340', 'CI350',
  'CI351', 'CI355', 'CI358', 'CI359', 'CI360', 'CI361', 'CI362', 'CI363',
  'CI364', 'CI365', 'CI366', 'CI367', 'CI394', 'CI395', 'CI396', 'ET082',
  'CE211', 'CM043', 'HL077', 'SA017', 'SC003', 'SC202', 'SC203',
  'CI068', 'CI055', 'CM046', 'CM045', 'CM201',
  'CI210', 'CI056', 'CI067', 'CM005', 'CM202',
  'CI212', 'CI057', 'CI064', 'CI237', 'CI166',
  'CI215', 'CI062', 'CE003', 'CI058', 'CI164',
  'CI162', 'CI065', 'CI059', 'CI061', 'SA214',
  'CI163', 'CI165', 'CI209', 'CI218', 'CI220',
  'CI221', 'CI211'
];

// Dictionary to store all data from the same subjects in order
var subjectDataObj = {};

// Array to store all subject datas from a student
var allSubjectsData = [];

function loadData()
{
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () 
  {
    // Request finished and response 
    // is ready and Status is "OK"
    if (this.readyState == 4 && this.status == 200)
      xmlStr = xmlhttp.responseXML;
  };

  xmlhttp.open("GET", "alunos.xml", true);
  xmlhttp.send();
}

function collectData()
{
  let input = document.getElementById("grr");
  let grrAlunoInput = input.value;
  let alunos = xmlStr.getElementsByTagName("ALUNO");
  let grrAluno, subCode, subName, situation, finalGrade, year, semester, frequency;
  let i, element, a;

  console.log(grrAlunoInput);

  // Sets everything back to zero
  allSubjectsData = [];
  subjectDataObj = {};

  for (i = 0; i < alunos.length; i++) 
  {
    grrAluno = alunos[i].getElementsByTagName("MATR_ALUNO")[0].childNodes[0].nodeValue;

    // Collect all necessary data from the student passed as input
    if (grrAluno === grrAlunoInput) 
    {
      subCode = alunos[i].getElementsByTagName("COD_ATIV_CURRIC")[0].childNodes[0].nodeValue;
      subName = alunos[i].getElementsByTagName("NOME_ATIV_CURRIC")[0].childNodes[0].nodeValue;
      situation = alunos[i].getElementsByTagName("SITUACAO")[0].childNodes[0].nodeValue;
      finalGrade = alunos[i].getElementsByTagName("MEDIA_FINAL")[0].childNodes[0].nodeValue;
      year = alunos[i].getElementsByTagName("ANO")[0].childNodes[0].nodeValue;
      semester = alunos[i].getElementsByTagName("PERIODO")[0].childNodes[0].nodeValue;
      frequency = alunos[i].getElementsByTagName("FREQUENCIA")[0].childNodes[0].nodeValue;

      // Check if subject code already exists in the object
      if (subjectDataObj.hasOwnProperty(subCode)) 
        subjectDataObj[subCode].push(new SubjectData(subCode, subName, situation, finalGrade, year, semester, frequency));
      else 
        subjectDataObj[subCode] = [new SubjectData(subCode, subName, situation, finalGrade, year, semester, frequency)];

      //GRR00000000

      // Turn everything to an array, but ordered the way we want
      allSubjectsData = Object.values(subjectDataObj).flat();
    }
  }

  updateGrade();

  // teste
  /*
  for (i = 0; i < allSubjectsData.length; i++)
  {
    console.log("COD: " + allSubjectsData[i].subjectCode);
    console.log("SITUACAO: " + allSubjectsData[i].situation);
    console.log("MEDIA FINAL: " + allSubjectsData[i].grade);
  }
  */
}

// Function that goes over the sorted array of subjects and gets
// the last record of a given subject code (the last record is 
// the one that matters for the box colors)
function getLastRecordOfSubject(subCode) 
{
  let lastRecord = null;
  let i;
  
  for (i = allSubjectsData.length - 1; i >= 0; i--) 
  {
    if (allSubjectsData[i].subjectCode === subCode) 
    {
      lastRecord = allSubjectsData[i];
      /*
      console.log("ID: " + allSubjectsData[i].subjectCode);
      console.log("SITUATION: " + allSubjectsData[i].situation);
      console.log("FINAL GRADE: " + allSubjectsData[i].finalGrade);
      console.log("YEAR: " + allSubjectsData[i].year);
      console.log("SEMESTER: " + allSubjectsData[i].semester);
      console.log("FREQUENCY: " + allSubjectsData[i].frequency);
      */
      break;
    }
  }
  return lastRecord;
}

function updateGrade()
{
  // Agora para achar a materia mais recente eh so ler o vetor ao contrario
  let i, subCode, lastRecord, element;

  for (i = 0; i < subjectCodes.length; i++) 
  {
    subCode = subjectCodes[i];
    lastRecord = getLastRecordOfSubject(subCode);

    element = document.getElementById(subCode);

    if (lastRecord && lastRecord.situation === "Aprovado") 
      element.style.backgroundColor = "green";
    else if (lastRecord && lastRecord.situation === "Reprovado por nota")
      element.style.backgroundColor = "red";
    else if (lastRecord && lastRecord.situation === "Reprovado por Frequência")
      element.style.backgroundColor = "red";
    else if (lastRecord && lastRecord.situation === "Matrícula")
      element.style.backgroundColor = "blue";
    else if (lastRecord && lastRecord.situation === "Equivalência de Disciplina")
      element.style.backgroundColor = "yellow";
    else if (lastRecord && lastRecord.situation === "Cancelado")
      element.style.backgroundColor = "red";
    else
      element.style.backgroundColor = "white";
  }
}

function handleLeftClick(e) 
{
  let clickedElement, subCode, subInfo;

  // Check if left button
  if (e.button === 0) 
  {
    clickedElement = e.target;

    // Checks if cliked in a subject box
    if (clickedElement.classList.contains("disciplina")) 
    {
      subCode = clickedElement.id;

      // Collect information about the clicked ID
      subInfo = getSubjectInfo(subCode);

      if (clickedElement.style.backgroundColor !== "white")
      {
        if (subInfo.situation !== "Matrícula" && subInfo.situation !== "Equivalência de Disciplina")
          swal(subInfo.subjectCode + " - " + subInfo.subjectName + "\n\n" +
              "Última vez cursada em: " + subInfo.semester + " de " + subInfo.year + "\n\n" +
              "Nota final: " + subInfo.finalGrade + "\n\n" +
              "Frequência: " + subInfo.frequency + "\n\n" +
              subInfo.situation + "\n\n"
          );
        else
          swal(subInfo.subjectCode + " - " + subInfo.subjectName + "\n\n" +
              subInfo.situation + "\n\n"
          );
      }
    }
  }
}

// Retrieve information about the subject using the ID
function getSubjectInfo(subCode) 
{
  let lastRecord;

  lastRecord = getLastRecordOfSubject(subCode);

  return lastRecord;
}

function handleRightClick(e) 
{
  let clickedElement, subCode, studentHistory;

  // Prevent the default context menu from appearing
  e.preventDefault(); 

  clickedElement = e.target;

  if (clickedElement.classList.contains("disciplina")) 
  {
    subCode = clickedElement.id;

    // Collect all the times the student went through the subject
    if (clickedElement.style.backgroundColor !== "white")
      collectSubjectHistory(subCode);
  }
}

function collectSubjectHistory(subCode) 
{
  let i = 0, subs = [];

  // Finds the position of the first record of the subject
  while (allSubjectsData[i].subjectCode !== subCode)
    i++;
  
  console.log(allSubjectsData[i].subjectCode);

  // Now store all of them
  while (allSubjectsData[i].subjectCode === subCode)
  {
    subs.push(allSubjectsData[i]);
    i++;

    // If it moved beyond the array
    if (i == allSubjectsData.length)
      break;
  }

  showSubjectHistory(subs);
}

function showSubjectHistory(subs)
{
  let i;

  subs.forEach(subject => {
    if (subject.situation !== "Matrícula" && subject.situation !== "Equivalência de Disciplina")
    {
      alert(
        subject.subjectCode + " - " + subject.subjectName + "\n\n" +
        "Cursou em: " + subject.semester + " de " + subject.year + "\n\n" +
        "Nota final: " + subject.finalGrade + "\n\n" +
        "Frequência: " + subject.frequency + "\n\n" +
        subject.situation + "\n\n"
      );
    }
    else
      alert(
        subject.subjectCode + " - " + subject.subjectName + "\n\n" +
        subject.situation + "\n\n"
      );  
  });
}

// Event listeners
document.addEventListener("mousedown", handleLeftClick);
document.addEventListener("contextmenu", handleRightClick);