using Microsoft.AspNetCore.Mvc;
using People_Directory.Models;
using System.Net.Mail;
using System.Net;

namespace People_Directory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        [HttpPost("send")]
        public async Task<IActionResult> SendEmail(EmailRequest request)
        {
            try
            {
               
                using (var client = new SmtpClient("smtp.gmail.com"))
                {
                    client.Port = 587;
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential("olebogengpeopledirectory@gmail.com", "glnx zovw ydjw pqdv");

         
                    var mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress("olebogengpeopledirectory@gmail.com");
                    mailMessage.To.Add(request.To);
                    mailMessage.Subject = request.Subject;
                    mailMessage.Body = request.Body;

               
                    await client.SendMailAsync(mailMessage);
                }

                return Ok("Email sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to send email: {ex.Message}");
            }
        }
    }
}
