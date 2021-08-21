const Joi = require("@hapi/joi");

const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

const userSchema = Joi.object({
  name: Joi.string().min(4).trim().max(64).required(),
  username: Joi.string().min(4).trim().max(64).required(),
  password: Joi.string().regex(RegExp(pattern)).required().min(8).max(20),
  email: Joi.string().email().allow(null).allow("").optional(),
  telephone: Joi.when("email", {
    is: "",
    then: Joi.string().required().min(10).max(10).messages({
      "string.min": `"telephone" should have a minimum length of 10`,
      "string.max": `"telephone" should have a miximum length of 10`,
    }),
    otherwise: Joi.string().allow(""),
  }),
});

const addSchema = Joi.object({
  tittle: Joi.string().min(20).trim().max(100).required(),
  description: Joi.string().min(30).trim().max(500).required(),
});

const forgetSchema = Joi.object({
  username: Joi.string().min(4).trim().max(64).required(),
  password: Joi.string().regex(RegExp(pattern)).required().min(6).max(20),
});

module.exports = { userSchema, addSchema, forgetSchema };