 class RDV {
     constructor() {
             this.Id = "",
             this.nom = "",
             this.prenom = "",
             this.date = new Date(),
             this.heure="",
             this.lieu="",
             this.tel="",
             this.MedecinId = "",
             this.SecretaireId="",
             this.PassId = "",
             this.email = "",
             this.etat = "",
            
             this.State = false,
             this.CreatedAt = new Date(),
             this.UpdatedAt = new Date()
     }
 }
 module.exports = RDV;