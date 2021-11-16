$("#sign-up").click(function () {
   $("#sign-up-card").toggleClass("d-none");
   $("#intro-card").toggleClass("d-none");
});

$("#lets-go").click(function (e) {
   const emailInput = $("#sign-up-email-input").val();
   const email = emailInput.trim().toLowerCase();
   const password = $("#sign-up-password-input").val();

   const emailError = getEmailError(email);

   const user = {
      email: email,
      password: password,
      createdAt: getCreatedAt(),
      id: getId(),
      emailTld: getTld(email),
      socialProfiles: [
         {
            site: "facebook",
            siteId: "530c2716-36e2-4a80-93b7-0e8483d629e1",
            username: "",
            image: {
               sm: "",
               orig: "",
            },
         },
         {
            site: "twitter",
            siteId: "79023b4d-57a2-406b-8efe-bda47fb1696c",
            username: "",
            image: {
               sm: "",
               md: "",
               orig: "",
            },
         },
      ],
   };

   let mostRecentSignUpDate = 0;

   dbUsers.forEach((user) => {
      if (user.createdAt > mostRecentSignUpDate) {
         mostRecentSignUpDate = user.createdAt;
      }
   });

   console.log("the most recent sign up date is", mostRecentSignUpDate);

   const mostRecentSignUp = dbUsers.find((user) => {
      return user.createdAt === mostRecentSignUpDate;
   });

   console.log("most recent sign up guy is", mostRecentSignUp);

   const dupUserIndex = dbUsers
      .map((user) => {
         return user.id;
      })
      .findIndex((id, i, arr) => {
         return arr.indexOf(id) !== i;
      });

   const uniqDbUsers = dbUsers.filter((user) => {
      return dbUsers.indexOf(user) != dupUserIndex;
   });

   console.log("the unique DB Users are", uniqDbUsers);

   const activeUser = deepCopy(user);
   activeUser.isActive = true;
   activeUser.createdAt = getEpochMs(user.createdAt);

   activeUser.socialProfiles.forEach((socialProfile) => {
      if (socialProfile.image.hasOwnProperty("sm")) {
         delete socialProfile.image.sm;
      }
      if (socialProfile.image.hasOwnProperty("md")) {
         delete socialProfile.image.md;
      }
   });

   const users = [user, activeUser];
   const currentUsers = users
      .map((user) => {
         //Now map over each of the 2 objects in users to create a new array where each object in the array has the same 5 properties: id, email, password, createdAt, and isActive. The values for each object should be the values they previously had. Note: if an object did not previously have an isActive property, give it one and set its value to false. The result of your map should be stored in a const named normalizedUsers.
         const newUser = {
            id: user.id,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            isActive: getIsActive(user),
         };
         return newUser;
      })
      .filter((normalizedUser) => {
         //But we’re not done yet! Chain a filter method to your map method to return only the users where isActive is true. Rename normalizedUsers to currentUsers. currentUsers should contain only one object in the array.
         return normalizedUser.isActive;
      });

   const currentUser = currentUsers;

   if (emailError !== "") {
      const element = "#sign-up-email";
      const errorMessage = emailError;
      showErrorMessage(element, errorMessage);
   } else {
      const element = "#sign-up-email";
      const errorMessage = emailError;
      hideErrorMessage(element, errorMessage);
      //Else hide any error messages/styling.
   }

   const passwordError = getPasswordError(password, email);

   if (passwordError !== "") {
      const element = "#sign-up-password";
      const errorMessage = passwordError;
      showErrorMessage(element, errorMessage);
   } else {
      const element = "#sign-up-password";
      const errorMessage = passwordError;
      hideErrorMessage(element, errorMessage);
      //Else hide any error messages/styling.
      console.log("The user is", user);
      console.log("The active user is", activeUser);
      console.log("The current user is", currentUser);
   }
   //If password error is not "",
});

function showErrorMessage(element, errorMessage) {
   //style and show error message.
   $(`${element}-input`).addClass("is-invalid");
   $(`${element}-error`).html(errorMessage);
}

function hideErrorMessage(element, errorMessage) {
   //Else hide any error messages/styling.
   $(`${element}-input`).removeClass("is-invalid");
   $(`${element}-error`).html(errorMessage);
}

function getCreatedAt() {
   const clickedAt = new Date(Date.now()); //This produces a date at the very moment the function runs.
   const year = clickedAt.getFullYear();
   const month = clickedAt.getMonth();
   const day = clickedAt.getDate();
   const formattedYear = String(year);
   let formattedMonth = String(month + 1);
   let formattedDay = String(day);

   //If the formatted length is less than 2, we will concat a 0 to the left of the string.  Else we leave it.

   if (formattedMonth.length < 2) {
      console.log("The month needs padding");
      //formattedMonth = "0" + formattedMonth;
      formattedMonth = padLeft(formattedMonth, 2, "0");
   }

   if (formattedDay.length < 2) {
      console.log("The day needs padding");
      //formattedDay = 0 + formattedDay;
      formattedDay = padLeft(formattedMonth, 2, "0");
   }

   return formattedYear + formattedMonth + formattedDay;
}

function getId() {
   const randomInt = getRandomInt(1, 999);
   const paddedInt = padLeft(randomInt, 3, "0");
   const createdAt = new Date(Date.now());
   const milliseconds = createdAt.getMilliseconds();
   const formattedMilliseconds = String(milliseconds);
   const paddedMilliseconds = padLeft(formattedMilliseconds, 3, "0");
   return paddedInt + paddedMilliseconds;
}

function padLeft(num, width, char) {
   const numAsStr = String(num);
   let padding = "";
   for (let i = 0; i < width; i++) {
      padding += char;
   }
   console.log("Padding is", padding);

   const concattedStr = padding + numAsStr;

   if (numAsStr.length >= width) {
      return numAsStr;
   }
   const slicedStr = concattedStr.slice(-width);
   return slicedStr;
}

function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max + 1 - min) + min); //max is normally exclusive, min is inclusive, so +1 allows you to include the max.
}

function getTld(email) {
   const listOfEmailParts = email.split("@");
   const domainEmail = listOfEmailParts[1];

   if (domainEmail === undefined) {
      return "";
   } else {
      const listOfDomainParts = domainEmail.split(".");

      if (listOfDomainParts === undefined) {
         return "";
      } else {
         return listOfDomainParts[1];
      }
   }
}

function deepCopy(obj) {
   const str = JSON.stringify(obj);

   return safelyParseJson(str);
}

function safelyParseJson(str) {
   try {
      JSON.parse(str);
   } catch {
      return str;
   }
   return JSON.parse(str);
}

function getEpochMs(value) {
   //This function breaks a date in YYYYMMDD format into one in milliseconds past the epoch.
   const originalDate = value.toString();
   const formattedYear = originalDate.slice(0, 4);
   const formattedMonth = originalDate.slice(4, 6) - 1;
   const formattedDay = originalDate.slice(6);
   const formattedDate = new Date(formattedYear, formattedMonth, formattedDay);
   const epochMs = formattedDate.getTime();

   return epochMs;
}

function getIsActive(user) {
   if (user.isActive === undefined) {
      return false;
   } else {
      return user.isActive;
   }
}

function removeSmAndMdImages(socialProfiles) {
   for (let i = 0; i < socialProfiles.length; i++) {
      const profile = socialProfiles[i];
      //const hasImageProp = profile.hasOwnProperty("image");
      const images = profile.image;
      const hasSmProp = images.hasOwnProperty("sm");
      const hasMdProp = images.hasOwnProperty("md");

      if (hasSmProp === true) {
         // if this profile has sm property, remove sm property
         delete images.sm;
      }

      if (hasMdProp === true) {
         // if this profile has md property, remove md property
         delete images.md;
      }
   }
   return socialProfiles;
}

function deepCopy(obj) {
   const str = JSON.stringify(obj);

   return safelyParseJson(str);
}

function safelyParseJson(str) {
   try {
      JSON.parse(str);
   } catch {
      return str;
   }
   return JSON.parse(str);
}
