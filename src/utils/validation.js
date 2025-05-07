function validateSignupInput({ firstName, lastName, emailId, password }) {
  if (!firstName || !lastName || !emailId || !password) {
    return "All fields are required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailId)) {
    return "Invalid email format.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null; // No validation errors
}

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((k) =>
    allowedEditFields.includes(k)
  );

  return isEditAllowed;
};
module.exports = { validateSignupInput, validateEditProfileData };
