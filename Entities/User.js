 class User{
        constructor(){
            this.Id = ""
            this.nom = "",
            this.prenom = "",
            this.date_naissance = "",
            this.address = "",
            this.Role ="",
            this.password ="",
            this.email = "",
            this.tel = "",
            this.genre="",
            this.isActive = "",
            this.file="",
           
            this.remarque="",

            this.specialite="",
            this.fix="",
            this.atitude_professionelle="",
            this.image="",
            this.assurance_maladie="",
            this.horaire_travail="",



            this.CreatedAt = new Date(),
            this.UpdatedAt =  new Date()
        }
    }
module.exports = User;