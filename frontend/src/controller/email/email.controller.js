class EmailController{
    constructor($http) {
        this.$http = $http
    }
    async sendEmail(details)
    {
        try {
            let result = await this.$http.post(`https://localhost:7024/api/email/send`, {
                to: 'olevated@gmail.com',
                subject: details.subject,
                body: `Data:\n
                \nID: ${details.fields.id} 
                \nImage Src : ${details.fields.picture}
                \nName: ${details.fields.name} \nSurname: ${details.fields.surname}
                \nEmail: ${details.fields.email} \nNumber: ${details.fields.phoneNumber} 
                \nCounty: ${details.fields.country} \nCity: ${details.fields.city}`
            })
            console.log(result.data);
            return result.data
        } catch (error) {
            console.error('Failed to send email:', error);
        }
    }
}

export default EmailController