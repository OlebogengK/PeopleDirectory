// PeopleApiController.cs
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using People_Directory.Data;
using People_Directory.Models;

namespace People_Directory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleApiController : ControllerBase
    {
        private readonly PeopleContext _context;

        public PeopleApiController(PeopleContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetPeople()
        {
            return await _context.People.ToListAsync();
        }
        [HttpGet("search")]
        public IActionResult Search(string searchTerm)
        {
            var people = _context.People
                .Where(p => p.Name.Contains(searchTerm) || p.Surname.Contains(searchTerm))
                .ToList();
            return Ok(people);
        }

        [HttpGet("{id}")]
        public IActionResult GetPerson(int id)
        {
            var person = _context.People.FirstOrDefault(p => p.Id == id);
            if (person == null)
            {
                return NotFound();
            }
            return Ok(person);
        }
    }
}

