var responsRender = require("../middleware/responseRender");
var userEntity = require("../Entities/User");
var rdvEntity = require("../Entities/RDV");
var mapper = require("automapper-js");
var ServerMessage = require("../constant/messages");
var ServerErrors = require("../constant/errors");
var Joi = require("@hapi/joi");
var uuid = require("uuid/v4");
var database = require("../data/DBconnect");
var userDataAccess = require("../data/UserDataAccess");
var rdvDataAccess = require("../data/RDVDataAccess")
var bcrypt = require("bcryptjs");
var roles = require("../constant/appRoles");
var decoder = require("../tools/AuthorizationDecode")
module.exports = {
  register: (rq, rs, nx) => {
    let UserModel = mapper(userEntity, rq.body);
    const schema = Joi.object().keys({
      Id: Joi.string().optional().allow(""),
      nom: Joi.string().optional().max(30).min(3).regex(/^[a-zA-Z_ ]+$/),
      prenom: Joi.string().optional().allow(""),
      address: Joi.string().optional().allow(""),
      date_naissance: Joi.date().optional().allow(""),
      Role: Joi.string().optional().allow(""),
      IsActive: Joi.boolean().optional().allow(""),
      tel: Joi.string().optional().allow(""),
      genre:Joi.string().optional().allow(""),
      remarque:Joi.string().optional().allow(""),
      email: Joi.string().email({
        minDomainSegments: 2
      }).optional().allow("").max(50),
      password: Joi.string().min(8).max(30).optional().allow(""),
      CreatedAt: Joi.string().optional().allow(""),
      UpdatedAt: Joi.string().optional().allow("")
    });

    const {
      error,
      value
    } = Joi.validate(rq.body, schema);

    if (error != null) {
      return rs
        .status(400)
        .json(responsRender(error, ServerErrors.INVALID_DATA, ""));
    }

    // verify email existance
    database.connectToDb()
    userDataAccess.getByCreteria({
      email: UserModel.email
    }, (err, user) => {
      database.disconnect()
      if (err) {
        return rs.status(500).json(responsRender(error, ServerErrors.SERVER_ERROR, ""));
      }

      if (typeof (user[0]) != "undefined") {
        return rs.status(200).json(responsRender(null, ServerErrors.ACCOUNT_ALREADY_EXIST, ""))
      } else {
        UserModel.Id = uuid();
        bcrypt.hash(UserModel.password, 11, (err, password) => {
          if (err) {
            return rs
              .status(500)
              .json(responsRender(error, ServerErrors.SERVER_ERROR, ""));
          }
          UserModel.password = password;
          UserModel.Role = roles.PATIENT;
          database.connectToDb();
          userDataAccess.AddUser(UserModel, (err, user) => {
            database.disconnect();
            if (err) {
              return rs
                .status(500)
                .json(responsRender(error, ServerErrors.SERVER_ERROR, ""));
            }
            user.Password = null;
            return rs
              .status(200)
              .json(responsRender(user, "", ServerMessage.ACCOUNT_CREATED));
          });
        });
      }
    })
  },

  addrdv: (rq, rs, nx) => {
    let RdvModel = mapper(rdvEntity, rq.body);
    const schema = Joi.object().keys({
          Id: Joi.string().optional().allow(""),
          Firstname: Joi.string().required().max(30).min(3).regex(/^[a-zA-Z_ ]+$/),
          Lastname: Joi.string().required().min(3) .max(30).regex(/^[a-zA-Z_ ]+$/),
          date: Joi.date().required(),
          PsyId: Joi.string().optional().allow(""),
          PassId: Joi.string().optional().allow(""),
          Email: Joi.string().email({
            minDomainSegments: 2
          }).required().max(50),
          Type: Joi.string().required(),
          message: Joi.string().required(),
          State: Joi.boolean().optional().allow(""),
          CreatedAt: Joi.string().optional().allow(""),
          UpdatedAt: Joi.string().optional().allow("")
    });

    const {
      error,
      value
    } = Joi.validate(rq.body, schema);

    if (error != null) {
      return rs
        .status(400)
        .json(responsRender(error, ServerErrors.INVALID_DATA, ""));
    }
       
        RdvModel.Id = uuid()
          database.connectToDb()
          rdvDataAccess.AddRdv(RdvModel, (err, rdv) => {
            database.disconnect();
            if (err) {
              return rs.status(500).json(responsRender(err, ServerErrors.SERVER_ERROR, ""))
            }else {
              if (rdv) {
            return rs.status(200).json(responsRender(rdv, "", ServerMessage.OK))
              }}
          })
       
   
  },

	



  update: (rq, rs, nx) => {
    let UserModel = mapper(userEntity, rq.body);
    const schema = Joi.object().keys({
      nom: Joi.string().required().max(30).min(3).regex(/^[a-zA-Z_ ]+$/),
      prenom: Joi.string().optional().allow(""),
      address: Joi.string().optional().allow(""),
      date_naissance: Joi.string().optional().allow(""),
      Role: Joi.string().optional().allow(""),
      IsActive: Joi.boolean().optional().allow(""),
      tel: Joi.string().optional().allow(""),
      genre:Joi.string().optional().allow(""),
      email: Joi.string().email({
        minDomainSegments: 2
      }).required().max(50),
    });

    const {
      error,
      value
    } = Joi.validate(rq.body, schema);

    if (error) {
      return rs.status(200).json(responsRender({}, serverErrors.INVALID_DATA, ""));
    }

    database.connectToDb();
    userDataAccess.GetUserById(UserModel.Id, (err, usr) => {
      if (err) {
        database.disconnect();
        return rs.status(500).json(responsRender({}, serverErrors.SERVER_ERROR, ""))
      } else if (usr && usr.length > 0) {
        UserModel.Birth = usr[0].Birth;
        UserModel.UpdatedAt = new Date();
        UserModel.CreatedAt = usr[0].CreatedAt;
        UserModel.Password = usr[0].Password;
        UserModel.Role = usr[0].Role;
        UserModel.IsActive = usr[0].IsActive;
        userDataAccess.updateUser(UserModel, (error, succes) => {
          database.disconnect()
          if (error) {
            return rs.status(500).json(responsRender({}, ServerErrors.SERVER_ERROR, ""))
          }
          if (succes && succes != "") {
            return rs.status(200).json(responsRender(succes, "", ServerMessage.OK))
          } else {
            return rs.status(404).json(responsRender({}, ServerErrors.ACCOUNT_NOT_FOUND, ""))
          }
        });
      } else {
        return rs.status(404).json(responsRender({}, ServerErrors.ACCOUNT_NOT_FOUND, ""))
      }
    });
  },

  delete: (rq, rs, nx) => {
    if (typeof (rq.params.id) === "undefined") {
      return rs.status(400).json(responsRender(null, ServerErrors.INVALID_DATA, ""))
    }

    database.connectToDb()
    userDataAccess.DeleteUserById(rq.params.id, function (err, succes) {
      database.disconnect()
      if (err) {
        return rs.status(500).json(responsRender(null, ServerErrors.SERVER_ERROR, ""))
      }
      return rs.status(200).json(responsRender(null, "", ServerMessage.OK))
    })
  },

  getpatient: (rq, rs, nx) => {
    database.connectToDb();
    userDataAccess.GetUserById(rq.params.id, function (err, user) {
      database.disconnect();
      if (err) {
        rs.status(400).json(responsRender({}, ServerErrors.SERVER_ERROR, ""));
      }
      if (user) {
        if (user.length == 0) {
          return rs.status(200).json(responsRender({}, ServerErrors.ACCOUNT_NOT_FOUND, ""))
        } else {
          user[0].Password = null;
          return rs.status(200).json(responsRender(user[0], "", ServerMessage.OK));
        }
      } else {
        return rs.status(200).json(responsRender({}, ServerErrors.ACCOUNT_NOT_FOUND, ""))
      }
    })
  },


  // addRdv: (rq, rs, nx) => {
  //   let RdvModel = mapper(rdvEntity, rq.body)
  //   const schema = Joi.object().keys({
  //     Id: Joi.string().optional().allow(""),
  //     date: Joi.date().required(),
  //     PsyId: Joi.string().required(),
  //     Email: Joi.string().email({
  //       minDomainSegments: 2
  //     }).required().max(50),
  //     Type: Joi.string().required(),
  //     CreatedAt: Joi.string().optional().allow(""),
  //     UpdatedAt: Joi.string().optional().allow("")
  //   });

  //   const {
  //     error,
  //     value
  //   } = Joi.validate(rq.body, schema);

  //   let token = rq.headers.authorization.split(" ")[1];
  //   RdvModel.PassId = decoder.getSubject(token)


  //   if (error != null) {
  //     return rs
  //       .status(400)
  //       .json(responsRender(error, ServerErrors.INVALID_DATA, ""));
  //   }

  //   RdvModel.Id = uuid()
  //   database.connectToDb()
  //   rdvDataAccess.AddRdv(rdvEntity, (err, rdv) => {
  //     if (err) {
  //       return rs.status(500).json(responsRender(err, ServerErrors.SERVER_ERROR, ""))
  //     }
  //     return rs.status(200).json(responsRender(rdv, "", ServerMessage.OK))
  //   })
  // },

  list: (rq, rs, nx) => {
    database.connectToDb()
    userDataAccess.ListByRole(roles.PATIENT, (err, list) => {
      database.disconnect()
      if (err) {
        return rs.status(500).json(responsRender(null, ServerErrors.SERVER_ERROR, ""))
      }
      list.forEach(element => {
        element.Password = null
      });
      return rs.status(200).json(responsRender(list, "", ServerMessage.OK))

    })
  },
  profile :(rq,rs,nx) => {
    let token = rq.headers.authorization.split(" ")[1];
    let Id = decoder.getSubject(token)
    database.connectToDb()
    userDataAccess.GetUserById(Id,(error,user)=>{
      database.disconnect()
      if (error) {
        return rs.status(500).json(responsRender(null, ServerErrors.SERVER_ERROR, ""))
      }
      return rs.status(200).json(responsRender(user, "", ServerMessage.OK))
    })
  },

 
}



