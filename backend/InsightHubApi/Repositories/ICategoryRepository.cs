using InsightHubApi.Models;

namespace InsightHubApi.Repositories;

public interface ICategoryRepository
{
    Task<Category> CreateAsync(Category category);

    Task<List<Category>> GetAllAsync();
}
