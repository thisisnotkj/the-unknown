var gameObj = {};
var idleTime = 0;
var time = new Date(Date.now()).toLocaleTimeString();
var txtlength = $(".gametxt").text().length;
$(document).ready(function() {

   localStorage.clear(); //developer only remove remove console.log

   if(localStorage.getItem("gameSave") != null){ //gamesave loading
      gameObj = JSON.parse(localStorage.getItem("gameSave"))
      console.log("=== LOADED SAVE ===")
   } else{
      console.log("=== UNABLE TO LOAD SAVE OR FIRST TIME PLAYER ===")
      gameObj.allowAmbientText = true;
      gameObj.plevel = 0;
      gameObj.phealth = 100;
      gameObj.pmana = 25;
      gameObj.pexp = 0;
      gameObj.prequiredxp = 100;
      localStorage.setItem("gameSave",JSON.stringify(gameObj));
   }

   var textspeed = 40;
   typeText(`<br>Did you know that, `,textspeed,".gametxt", "yellow");
   typeText(`<br>I enjoy typing.`,textspeed,".gametxt","white");

   createUActionBtn(4,null,"ATTACK");

   setInterval(() => {
      idleTime += 1;
      if(idleTime > 25 && gameObj.allowAmbientText == true){ // add extra checks for individual text pieces
         idleTime = 0;
         $(".specialtxtspan").remove(); // for now, remove if longer story
         typeText(`<br>Pizza with pineapple is pretty good ..`,30,".gametxt","red",true);
      }
   }, 1000);
});

function clearUABtn(){
   $(".ubtnbase").remove();
}

function createUActionBtn(amt,_class,txt){ //create buttons
   for(let i=0;i<amt;i++){ //create amt of btns
      let btn = $("<button>");

      $(btn).addClass(`ubtnbase`); //add base class 
      if(_class != undefined || _class != null){ //add extra class if class is defined
         $(btn).addClass(`${_class}`);
      }
      //add class of button you want
      $(btn).text(`${txt}`); //make button text to txt

      let uinput = $(".useractionchoice");
      $(uinput).append(btn);
   };
}
//start of typetext function
var ableToType = { //keeps track of individual components and whether or not we are done typing in them
   ".gametxt": true,
   ".useractionchoice":true,
};
function typeText(text,speed, target,color,special,) {
   for(var key in ableToType){
      if(key === target){
         if(ableToType[key] === true){
            ableToType[key] = false;
            time = new Date(Date.now()).toLocaleTimeString();
   
            // Get the element to append the text to
            var element = $(target);
            var span = $("<span>");
            if(special == undefined || special == null){
               span.addClass("txtspan");
            }else{
               span.addClass("specialtxtspan");
            }
            if(color != null || color != undefined){
               span.css("color",`${color}`)
            } else{
               span.css("color",`white`);
            }
            
            element.append(span);

         
            // Split the text into an array of characters
            var textArray = text.split("");
         
            // Check if the first character is a line break
            if (textArray[0] === "<") {
               // Check if the second character is "b"
               if (textArray[1] === "b") {
                  // Check if the third character is "r"
                  if (textArray[2] === "r") {
                     // Check if the fourth character is ">"
                     if (textArray[3] === ">") {
                     // Insert a line break using jQuery's append method
                     if(special == undefined || special == null){
                        span.append("<br>");
                        span.append(`${time}: `);
                     }else{
                        span.append("<br>");
                     }
            
                     // Remove the first four characters from the array
                     textArray.splice(0, 4);
                     }
                  }
               }
            }
         
            // Loop through the array of characters
            $.each(textArray, function(i, letter) {
            // Check if the character is a line break
            if (letter === "<") {
               // Check if the next character is "b"
               if (textArray[i + 1] === "b") {
                  // Check if the next character is "r"
                  if (textArray[i + 2] === "r") {
                     // Check if the next character is ">"
                     if (textArray[i + 3] === ">") {
                        // Insert a line break using jQuery's append method
                        if(special == undefined || special == null){
                           span.append("<br>");
                           span.append(`${time}: `);
                        } else{
                           span.append("<br>");
                        }
            
                        // Skip the next three characters
                        i += 3;
            
                        // Return to continue the loop
                        return;
                     }
                  }
               }
            }
            // Append the character to the element with a delay
            setTimeout(function() {
               span.append(letter);
            }, speed * i);
            });

            // Use the setTimeout function to pause additional runs until this one is done
            setTimeout(function() {
               // allow new typetext calls;
               key = target; //wtf it just forgets?
               ableToType[key] = true;
            }, speed * textArray.length);

         }else{
            var interval = setInterval(function() {
               // Check if the typing is complete
               if (ableToType[key] == true) {
                  txtlength = $(".gametxt").text().length;
                  typeText(text,speed,target);
                  clearInterval(interval);
               };
            }, speed);
         }
      }
   }
};
 