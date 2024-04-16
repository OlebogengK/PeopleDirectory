using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using People_Directory.Data;
using People_Directory.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace People_Directory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleAdminController : ControllerBase
    {
        private readonly PeopleContext _context;
        private readonly IConfiguration _configuration;

        public PeopleAdminController(PeopleContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/peopleadmin/people
        [HttpPost("people")]
        public async Task<ActionResult<Person>> CreatePerson(Person person)
        {
            _context.People.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPerson), new { id = person.Id }, person);
        }

        [HttpPost("login")]
        public IActionResult Login(Admin admin)
        {
            var existingAdmin = _context.Admins.SingleOrDefault(a => a.Email == admin.Email);
            if (existingAdmin == null || existingAdmin.Password != admin.Password)
            {
                return Unauthorized(); // Invalid username or password
            }


            return Ok();
        }


        // GET: api/peopleadmin/people/{id}
        [HttpGet("people/{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            var person = await _context.People.FindAsync(id);

            if (person == null)
            {
                return NotFound();
            }

            return person;
        }

        // PUT: api/peopleadmin/people/{id}
        [HttpPut("people/{id}")]
        public async Task<IActionResult> UpdatePerson(int id, Person updatedPerson)
        {
            var existingPerson = await _context.People.FindAsync(id);
            if (existingPerson == null)
            {
                return NotFound(); // If the person doesn't exist, return a NotFound response
            }

            // Update existingPerson with data from updatedPerson
            existingPerson.Name = updatedPerson.Name;
            existingPerson.Surname = updatedPerson.Surname;
            existingPerson.Email = updatedPerson.Email;
            existingPerson.City = updatedPerson.City;
            existingPerson.Country = updatedPerson.Country;
            existingPerson.PhoneNumber = updatedPerson.PhoneNumber;
            existingPerson.Picture = updatedPerson.Picture;

            // Set the EntityState to Modified
            _context.Entry(existingPerson).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent(); // Return a successful response with no content
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(id))
                {
                    return NotFound(); // If the person doesn't exist, return a NotFound response
                }
                else
                {
                    throw; // Otherwise, rethrow the exception
                }
            }
        }

        // DELETE: api/peopleadmin/people/{id}
        [HttpDelete("people/{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            _context.People.Remove(person);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PersonExists(int id)
        {
            return _context.People.Any(e => e.Id == id);
        }
    }
}
