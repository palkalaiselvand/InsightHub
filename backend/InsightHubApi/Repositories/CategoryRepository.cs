using InsightHubApi.Config;
using InsightHubApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace InsightHubApi.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly IMongoCollection<Category> _categories;

    public CategoryRepository(IOptions<MongoSettings> mongoOptions)
    {
        var settings = mongoOptions.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _categories = database.GetCollection<Category>("categories");
    }

    public async Task<Category> CreateAsync(Category category)
    {
        await _categories.InsertOneAsync(category);
        return category;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _categories.Find(Builders<Category>.Filter.Empty)
            .SortBy(c => c.Name)
            .ToListAsync();
    }
}
