using InsightHubApi.Config;
using InsightHubApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace InsightHubApi.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(IOptions<MongoSettings> mongoOptions)
    {
        var settings = mongoOptions.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _users = database.GetCollection<User>("users");
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Email, email.ToLowerInvariant());
        return await _users.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _users.Find(Builders<User>.Filter.Empty)
            .SortByDescending(u => u.CreatedAt)
            .ToListAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        user.Email = user.Email.ToLowerInvariant();
        user.CreatedAt = DateTime.UtcNow;
        await _users.InsertOneAsync(user);
        return user;
    }
}
