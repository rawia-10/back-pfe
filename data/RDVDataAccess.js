var RDV = require("../models/RDV");

//AddUser
exports.AddRdv = (rdvEntity, callback) => {
    RDV.create(rdvEntity, function (err, rdv) {
        callback(err, rdv)
    })
}
exports.ListByRDV = (rdv, callback) => {
    RDV.find( function (err, rdvs) {
        callback(err, rdvs)
    })
}

//Delete
exports.DeleteRdvyId = (id, callback) => {
    RDV.remove({
        Id: id
    }, function (err, success) {
        callback(err, success)
    })
}

exports.DeleteByCreteria = (createria, callback) => {
    RDV.remove(createria, function (err, success) {
        callback(err, success)
    })
}

exports.ListByMedecin = (Id, callback) => {
             this.MedecinId = "",
    RDV.find({MedecinId:Id}, (err, rdvs)=> {
        callback(err, rdvs)
    })
}


exports.ListBySecretaire = (Id, callback) => {
    this.SecretaireId = "",
RDV.find({SecretaireId:Id}, (err, rdvs)=> {
callback(err, rdvs)
})
}


// list all psy rdv where psyId = Id and state is true (confirmed)
exports.ListConfirmedByMedecin = (Id, callback) => {
    RDV.find({
        $and: [{
            MedecinId: Id
        }, {
            State: true
        }]
    }, (err, rdvs) => {
        callback(err, rdvs)
    })
}

exports.getByCreteria = (creteria, callback) => {
    RDV.find(creteria, (err, rdv) => {
        callback(err, rdv)
    })
}




