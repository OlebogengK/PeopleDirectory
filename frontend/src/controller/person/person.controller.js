
class PersonController {
    constructor($http) {
        this.$http = $http
    }
    async getAllPeople(){
        try {
            let result = await this.$http.get(`https://localhost:7024/api/peopleapi`, {})

            return result.data
        } catch (error) {
            throw Error(error)
        }
    }
    async searchUser(name) {
        try {
            let result = await this.$http.get(`https://localhost:7024/api/peopleapi/search?searchTerm=${name}`, {})

            return result
        } catch (error) {
            throw Error(error)
        }
    }
    async showDetails(id)
    {
        try {
            let result = await this.$http.get(`https://localhost:7024/api/peopleapi/${id}`, {})

            return result
        } catch (error) {
            throw Error(error)
        } 
    }
}

export default PersonController
