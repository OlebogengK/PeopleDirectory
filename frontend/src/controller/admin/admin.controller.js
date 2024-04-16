class AdminController {
    constructor($http) {
        this.$http = $http
    }
    async adminLogin(admin)
    {
        try{
            let result = await this.$http.post(`https://localhost:7024/api/peopleadmin/login/`, {
                email: admin.email,
                password: admin.password
            })
            console.log(result)
            return result
        }
        catch(error)
        {
            throw Error(error)
        }
    }
    async addPerson(person){
        try {
            let result = await this.$http.post(`https://localhost:7024/api/peopleadmin/people/`, {
                picture: person.picture,
                name: person.name,
                surname: person.surname,
                country: person.country,
                city: person.city,
                email: person.email,
                phoneNumber: person.phoneNumber
            })

            return result.data
        } catch (error) {
            throw Error(error)
        }
    }
    async editPerson(id,person) {
        try {
            let result = await this.$http.put(`https://localhost:7024/api/peopleadmin/people/${id}`, {
                picture: person.picture,
                name: person.name,
                surname: person.surname,
                country: person.country,
                city: person.city,
                email: person.email,
                phoneNumber: person.phoneNumber
            })

            return result
        } catch (error) {
            throw Error(error)
        }
    }
    async showDetails(id)
    {
        try {
            let result = await this.$http.put(`https://localhost:7024/api/peopleapi/${id}`, {})

            return result
        } catch (error) {
            throw Error(error)
        } 
    }
    async deletePerson(id)
    {
        try {
            let result = await this.$http.delete(`https://localhost:7024/api/peopleadmin/people/${id}`, {})

            return result
        } catch (error) {
            throw Error(error)
        }
    }
}

export default AdminController