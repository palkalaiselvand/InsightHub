using InsightHubApi.Models;

namespace InsightHubApi.Repositories;

public interface IPostRepository
{
    Task<Post> CreateAsync(Post post);

    Task<Post?> GetByIdAsync(string id);

    Task<List<Post>> GetAllAsync();

    Task<List<Post>> GetPublishedAsync(string? categoryId = null);

    Task<Post?> UpdateAsync(string id, Post post);

    Task<bool> DeleteAsync(string id);
}
