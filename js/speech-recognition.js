// 語音辨識物件
var recognition;
// 語音合成物件
var synth;
// 句子說話
var msg;

// 辨識結果旗標
var resultFlag = false;

var isRecognition = false;

listen();

speechSynthesisInit();

$('.microphone').bind('click',recognitionStart);
//語音識別按鈕監聽事件
function recognitionStart(){
  if(!isRecognition){
    isRecognition = true ;
    
    resultFlag = false;
    
    $('#recognitionFinal').html("");
    
    recognition.start(); 
  }
}
//語音辨識
function listen(){
  recognition = new webkitSpeechRecognition();
  // true : 連續辨識語音直至結束, false : 辨識一段話即結束
  recognition.continuous=true;
  // true : 立即辨識, false : 過一段時間才辨識
  recognition.interimResults=true;
  // 語系
  recognition.lang="cmn-Hant-TW";
  // 開始辨識
  recognition.onstart = function(){
    // 改變圖示，代表正在辨識中
    $('.microphone').attr("src","img/microphone-start.png");
  };
  // 停止辨識
  recognition.onend = function(){
    // 改回原圖示
    $('.microphone').attr("src","img/microphone-stop.png");
    isRecognition = false ;
  };
  // 識別結果
  recognition.onresult = function(event){
    console.log(event);
    var i = event.resultIndex;
    var transcript;
    // 取出辨識結果
    transcript = event.results[i][0].transcript;
    // 辨識飲料名稱
    var recognition_result = drinksRecognition(transcript);
    // 辨識出飲料結果
    if(recognition_result != -1 && !resultFlag){
      // 使用語音說飲料名稱
      speak(recognition_result);
      // 顯示在介面上
      $('#recognitionFinal').html(recognition_result);
      // 將飲料結果輸出 .txt
      var blob = new Blob([transform(recognition_result)], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "drinks.txt");
      resultFlag = true;
      recognition.stop(); 
    }
    if(event.results[i].isFinal){
      if(!resultFlag){
        $('#recognitionFinal').html("請再講一次");
        speak("請再講一次");
      }
      recognition.stop(); 
    }  
    $('#recognitionInit').html(transcript);
  };
}
//語音合成初始化
function speechSynthesisInit(){

  synth = window.speechSynthesis;
  
  msg = new SpeechSynthesisUtterance();
  
  var voice = [] ;
  //得到語音模組
  voice = synth.getVoices();
  //中文(台灣話)
  msg.voice = voice[20];
  
  msg.onend = function(e) {
    console.log('Finished in ' + event.elapsedTime + ' seconds.');
  };
}
//語音合成
function speak(content) {
  
  msg.text = content;

  synth.speak(msg);
}
//辨識飲料名稱
function drinksRecognition(transcript){

  var drink = drinks(transcript);

  if(drink != -1){
    var sugar = sugars(transcript);

    var ice = ices(transcript);

    if(sugar != -1 && ice != -1){
      var drink_name = drink + sugar + ice;
      
      return drink_name;
    }
    else{
      //錯誤
      return -1;
    }
  }else{	
    //錯誤
    return -1;
  }
}
function drinks(transcript){
  if(transcript.indexOf("紅綠茶") !=-1)
  {
    return "紅綠茶";
  }
  else if(transcript.indexOf("冬瓜紅茶") !=-1){
    return "冬瓜紅茶";
  }
  else if(transcript.indexOf("冬瓜綠茶") !=-1){
    return	"冬瓜綠茶";
  }
  else if(transcript.indexOf("冬瓜多多") !=-1){
    return	"冬瓜多多";
  }
  else if(transcript.indexOf("多多紅茶") !=-1){
    return 	"多多紅茶";
  }
  else if(transcript.indexOf("多多綠茶") !=-1){
    return  "多多綠茶";
  }
  else{
    return -1;
  }
}
function sugars(transcript){
  if(transcript.indexOf("全糖") !=-1)
  {
    return "全糖";
  }
  else if(transcript.indexOf("半糖") !=-1){
    return "半糖";
  }
  else if(transcript.indexOf("微糖") !=-1){
    return	"微糖";
  }
  else if(transcript.indexOf("無糖") !=-1){
    return	"無糖";
  }
  else{
    return -1;
  }
}
function ices(transcript){
  if(transcript.indexOf("全冰") !=-1)
  {
    return "全冰";
  }
  else if(transcript.indexOf("少冰") !=-1){
    return "少冰";
  }
  else if(transcript.indexOf("微冰") !=-1){
    return	"微冰";
  }
  else if(transcript.indexOf("去冰") !=-1){
    return	"去冰";
  }
  else{
    return -1;
  }
}
function transform(recognition_result){
  var length = recognition_result.length;
  
  var drink_result;
  
  var sugar_result;
  
  var ice_result;
  
  var transform_result;
  
  if(recognition_result.length == 8){
    drink_result = recognition_result.substring(0,4);
    
    sugar_result = recognition_result.substring(4,6);
    
    ice_result = recognition_result.substring(6,8);
  }else{
    drink_result = recognition_result.substring(0,3);
    
    sugar_result = recognition_result.substring(3,5);
    
    ice_result = recognition_result.substring(5,7);
  }
  
  switch(drink_result){
    case "紅綠茶":{
      transform_result = "12";
      break;
    }
    case "冬瓜紅茶":{
      transform_result = "31";
      break;
    }
    case "冬瓜綠茶":{
      transform_result = "32";
      break;
    }
    case "冬瓜多多":{
      transform_result = "34";
      break;
    }
    case "多多紅茶":{
      transform_result = "41";
      break;
    }
    case "多多綠茶":{
      transform_result = "42";
      break;
    }
  }
  
  switch(sugar_result){
    case "全糖":{
      transform_result = transform_result + "3";
      break;
    }
    case "半糖":{
      transform_result = transform_result + "2";
      break;
    }
    case "微糖":{
      transform_result = transform_result + "1";
      break;
    }
    case "無糖":{
      transform_result = transform_result + "0";
      break;
    }
  }
  
  switch(ice_result){
    case "全冰":{
      transform_result = transform_result + "3";
      break;
    }
    case "少冰":{
      transform_result = transform_result + "2";
      break;
    }
    case "微冰":{
      transform_result = transform_result + "1";
      break;
    }
    case "去冰":{
      transform_result = transform_result + "0";
      break;
    }
  }
  
  return transform_result;
}
