var gameObj = {};
var idleTime = 0;
var time = new Date(Date.now()).toLocaleTimeString();
var txtlength = $(".gametxt").text().length;
var textspeed = 25;
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
      gameObj.pmaxhealth = 100;
      gameObj.pmana = 25;
      gameObj.pmaxmana = 25;
      gameObj.pexp = 0;
      gameObj.prequiredxp = 100;
      localStorage.setItem("gameSave",JSON.stringify(gameObj));
   }
   updatePlayerHP();
   storyTime();

   setInterval(() => {
      idleTime += 1;
      if(idleTime > 30 && gameObj.allowAmbientText == true){ // add extra checks for individual text pieces
         idleTime = 0;
         $(".specialtxtspan").remove(); // for now, remove if longer story
         typeText(`<br>Are you still playing? ..`,35,".gametxt","red",true);
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
            } else{
               span.append(`${time}: `);
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

function updatePlayerHP() {
   let playerhp = document.getElementById("php");
   let playermaxhp = document.getElementById("pmaxhp");
   let hp = gameObj.phealth// Get the current value of the hp variable
   let percent = (hp / gameObj.pmaxhealth) * 100; // Calculate the percentage of hp remaining
   let pmaxhp = 100-percent;
   let pmaxhpleft = 100-pmaxhp;

   if(percent >= 100){
      percent = 100;
      playerhp.style.width = `${percent}%`;
      playermaxhp.style.display="none";
      playerhp.style.borderTopRightRadius = "5px";
      playerhp.style.borderBottomRightRadius = "5px";
   } else{
      playerhp.style.width = `${percent}%`;
      playermaxhp.style.display="block";
      playerhp.style.borderTopRightRadius = "0px";
      playerhp.style.borderBottomRightRadius = "0px";
   }
   
   if(100-pmaxhp <= 0){
      pmaxhpleft = 0;
      pmaxhp = 100;
      playermaxhp.style.width = `${pmaxhp}%`;
      playermaxhp.style.borderTopLeftRadius = "5px";
      playermaxhp.style.borderBottomLeftRadius = "5px";
   } else{
      playermaxhp.style.width = `${pmaxhp}%`;
      playermaxhp.style.borderTopLeftRadius = "0px";
      playermaxhp.style.borderBottomLeftRadius = "0px";
   }
   playermaxhp.style.left = `${pmaxhpleft}%`;
 }
 
 function pickRandomProperty (obj){
   let keys = Object.keys(obj);
   let index = keys.length * Math.random() << 0;
   return { value: obj[keys[index]], index: keys[index] };
}

function storyTime(){
   if (gameObj.plevel == 0){
      let randomstart = pickRandomProperty(LEVEL_0_STARTING_STORIES)
      typeText(randomstart.value,textspeed,".gametxt", "white");
      
      if(randomstart.index === '1'){
         createUActionBtn(1,null,"Try to break free from the restraints.");
         createUActionBtn(1,null,"Look for a way out of the room.");
         createUActionBtn(1,null,"Wait for the person approaching to enter the room.");
         createUActionBtn(1,null,"Scream for help.");
      } else if(randomstart.index === '2'){
         createUActionBtn(1,null,"Follow the map to the lost city.");
         createUActionBtn(1,null,"Explore the forest for clues or helpful objects.");
         createUActionBtn(1,null,"Set up camp and wait for morning.");
         createUActionBtn(1,null,"Try to find the source of the feeling that you're being watched.");
         createUActionBtn(1,null,"Head back to civilization.");
      }else if(randomstart.index === '3'){
         createUActionBtn(1,null,"Find a way to disable the security systems.");
         createUActionBtn(1,null,"Distract the guards.");
         createUActionBtn(1,null,"Find a way to sneak past the guards undetected.");
         createUActionBtn(1,null,"Abandon the mission and come up with a new plan.");
      }else if(randomstart.index === '4'){
         createUActionBtn(1,null,"Examine the crime scene for clues.");
         createUActionBtn(1,null,"Interview the victim's friends and family.");
         createUActionBtn(1,null,"Follow leads to other suspects.");
         createUActionBtn(1,null,"Hack into the victim's computer to search for clues.");
         createUActionBtn(1,null,"Wait for the killer to make their next move.");
      }else if(randomstart.index === '5'){
         createUActionBtn(1,null,"Explore the academy for clues.");
         createUActionBtn(1,null,"Research ancient magic to find a solution.");
         createUActionBtn(1,null,"Confront the headmaster about the strange occurrences.");
         createUActionBtn(1,null,"Gather a group of friends to help you.");
         createUActionBtn(1,null,"Try to ignore the strange occurrences and focus on your studies.");
      }else if(randomstart.index === '6'){
         createUActionBtn(1,null,"Attack the ship head on.");
         createUActionBtn(1,null,"Try to sneak aboard and steal the treasure covertly.");
         createUActionBtn(1,null,"Use your pirate charm to try to win the sorceress over.");
         createUActionBtn(1,null,"Try to negotiate a deal with the sorceress.");
         createUActionBtn(1,null,"Abort the mission and find a new target.");
      }else if(randomstart.index === '7'){
         createUActionBtn(1,null,"Try to repair the ship's systems.");
         createUActionBtn(1,null,"Look for alternative sources of oxygen.");
         createUActionBtn(1,null,"Send out a distress signal.");
         createUActionBtn(1,null,"Abandon ship and use the escape pods.");
         createUActionBtn(1,null,"Try to use your knowledge of the ship's systems to think of a solution.");
      }else if(randomstart.index === '8'){
         createUActionBtn(1,null,"Explore the new world.");
         createUActionBtn(1,null,"Try to find inhabitants of the new world.");
         createUActionBtn(1,null,"Try to find a way to defend yourself against the possible dangers of the new world.");
         createUActionBtn(1,null,"Try to find a way to adapt and make a new life in the new world.");
      }else if(randomstart.index === '9'){
         createUActionBtn(1,null,"Gather as much information as you can and try to escape unnoticed.");
         createUActionBtn(1,null,"Try to outsmart or disable your pursuer.");
         createUActionBtn(1,null,"Use your combat training to fight your way out.");
         createUActionBtn(1,null,"Try to blend in with the facility's employees and escape during a shift change.");
         createUActionBtn(1,null,"Leave the mission and report back to your superiors.");
      }else if(randomstart.index === '10'){
         createUActionBtn(1,null,"Try to outwit and outmaneuver your rival.");
         createUActionBtn(1,null,"Try to find a way to disable the traps and puzzles.");
         createUActionBtn(1,null,"Use your combat training to fight your way out.");
         createUActionBtn(1,null,"Work with your rival to reach the artifact faster and then double-cross them.");
         createUActionBtn(1,null,"Abandon the mission and come up with a new plan.");
      }
         
   }
}
