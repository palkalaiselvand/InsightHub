using InsightHubApi.Config;
using InsightHubApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace InsightHubApi.Repositories;

public class PostRepository : IPostRepository
{
    private readonly IMongoCollection<Post> _posts;

    public PostRepository(IOptions<MongoSettings> mongoOptions)
    {
        var settings = mongoOptions.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _posts = database.GetCollection<Post>("posts");
    }

    public async Task<Post> CreateAsync(Post post)
    {
        post.CreatedAt = DateTime.UtcNow;
        await _posts.InsertOneAsync(post);
        return post;
    }

    public async Task<Post?> GetByIdAsync(string id)
    {
        var filter = Builders<Post>.Filter.Eq(p => p.Id, id);
        return await _posts.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<Post>> GetAllAsync()
    {
        return await _posts.Find(Builders<Post>.Filter.Empty)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Post>> GetPublishedAsync(string? categoryId = null)
    {
        var filter = Builders<Post>.Filter.Eq(p => p.Status, "Published");

        if (!string.IsNullOrWhiteSpace(categoryId))
        {
            filter = Builders<Post>.Filter.And(
                filter,
                Builders<Post>.Filter.Eq(p => p.CategoryId, categoryId)
            );
        }

        return await _posts.Find(filter)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Post?> UpdateAsync(string id, Post post)
    {
        var update = Builders<Post>.Update
            .Set(p => p.Title, post.Title)
            .Set(p => p.Content, post.Content)
            .Set(p => p.CategoryId, post.CategoryId)
            .Set(p => p.Status, post.Status);

        return await _posts.FindOneAndUpdateAsync(
            Builders<Post>.Filter.Eq(p => p.Id, id),
            update,
            new FindOneAndUpdateOptions<Post> { ReturnDocument = ReturnDocument.After }
        );
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _posts.DeleteOneAsync(Builders<Post>.Filter.Eq(p => p.Id, id));
        return result.DeletedCount > 0;
    }
}
