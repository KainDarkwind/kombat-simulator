function getEmailError(email) {
   const emailLength = email.length;
   const emailPattern = /^[\w]\S*@[a-zA-Z\d][\w-]+\.[a-zA-Z]{2,}$/;
   const isValidEmail = emailPattern.test(email);

   console.log("The email entered is:", email);
   console.log("The email entered is valid:", isValidEmail);

   //const trimmedEmail = emailInput.trim();
   //   const lowerCasedEmail = trimmedEmail.toLowerCase();

   // const passwordPattern = /^[\w!#\\/-]{9,}\s{0}$/;

   if (emailLength === 0) {
      console.log("There is no email text entered.");
      return "Please enter your email address.";
   } else if (isValidEmail === false) {
      console.log("Doesn't pass the regex vibe.");
      return "Please enter a valid email address.";
   } else {
      console.log("The email is just right.");
      return "";
   }
}
