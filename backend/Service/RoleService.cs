using backend.Base;
using backend.Data;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class RoleService(LMSContext context) : IRoleService
    {
        private readonly LMSContext _context = context;

        public async Task<Role> CreateAsync(Role role)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return role;
        }

        public async Task<List<Role>> GetAllAsync()
        {
            return await _context.Roles.Include(r => r.Users).ToListAsync();
        }

        public async Task<Role?> GetByIdAsync(int id)
        {
            return await _context.Roles
                .Include(r => r.Users)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Role?> UpdateAsync(int id, Role updatedRole)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return null;

            role.RoleName = updatedRole.RoleName;
            // Note: Update of Users collection might require more complex logic
            await _context.SaveChangesAsync();
            return role;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return false;

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return true;
        }

        public Task<(List<Role>, int)> GetAllAsync(Pagination pagination)
        {
            throw new NotImplementedException();
        }
    }
}
