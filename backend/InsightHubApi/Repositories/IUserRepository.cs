using InsightHubApi.Models;

namespace InsightHubApi.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task<List<User>> GetAllAsync();

    Task<User> CreateAsync(User user);
}
