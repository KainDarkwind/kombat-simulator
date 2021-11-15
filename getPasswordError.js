function getPasswordError(password, email) {
   const normalizedPassword = password.toLowerCase().trim();
   const passwordInputLength = normalizedPassword.length;
   const listOfEmailParts = email.split("@");
   // Split removes the item it is searching for, and places the other pieces into an array.  An empty string "" will return a split up list of each individual character.

   const localEmail = listOfEmailParts[0];
   const unacceptablePasswords = getUnacceptablePasswords();

   if (passwordInputLength === 0) {
      console.log("There is no password text entered.");
      return "Please create a password.";
   } else if (passwordInputLength < 9) {
      console.log("The password is too short.");

      return "Your password must be at least 9 characters.";
   } else if (
      normalizedPassword.includes(localEmail) &&
      localEmail.length >= 4
   ) {
      console.log("The password cannot match email.");

      return "All or part of your email address cannot be used in your password.";
   } else if (unacceptablePasswords.includes(normalizedPassword)) {
      console.log("The password cannot be lame.");
      console.log(
         "This is the final list of unacceptable passwords:",
         unacceptablePasswords
      );
      return `Your password contains a commonly used password, "${password}" and can be easily discovered by attackers. Please use something else.`;
   } else {
      console.log("The password is just right.");
      console.log("The user's email is", email);
      return "";
   }
}

function getUnacceptablePasswords() {
   const flatSecondMostInsecurePasswords = secondMostInsecurePasswords
      .flat()
      .filter((password) => {
         return typeof password != "boolean";
      });

   const extractedAllInsecurePasswords = allInsecurePasswords.map(
      (password) => {
         return password.text;
      }
   );

   const originalTriplePasswords = [
      ...extractedAllInsecurePasswords,
      ...flatSecondMostInsecurePasswords,
      ...mostInsecurePasswords,
   ];

   const nobamaList = originalTriplePasswords.filter((password) => {
      return password != "obama2016" && password != "skywalker";
   });

   const normalizedPasswords = nobamaList.map((password) => {
      return String(password).toLowerCase().trim();
   });

   const mirroredPasswords = normalizedPasswords.map((password) => {
      return password.split("").reverse().join("");
   });

   const penultimatePasswords = [...normalizedPasswords, ...mirroredPasswords];

   longPasswords = penultimatePasswords.filter((password) => {
      return password.length >= 9;
   });

   const unacceptablePasswords = [...new Set(longPasswords)];

   const arePasswordsLongEnough = unacceptablePasswords.every((password) => {
      if (password.length >= 9) {
         return true;
      }
   });
   console.log("PWs long enuff?", arePasswordsLongEnough);

   const isQwertyHere = unacceptablePasswords.some((password) => {
      if (password.includes("qwerty")) {
         return true;
      }
   });
   console.log("Qwerty here?", isQwertyHere);

   return unacceptablePasswords;
}
