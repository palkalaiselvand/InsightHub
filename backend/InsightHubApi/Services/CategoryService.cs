using InsightHubApi.DTOs;
using InsightHubApi.Models;
using InsightHubApi.Repositories;

namespace InsightHubApi.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<CategoryResponseDto> CreateAsync(CreateCategoryRequestDto request)
    {
        var created = await _categoryRepository.CreateAsync(
            new Category
            {
                Name = request.Name.Trim()
            }
        );

        return ToDto(created);
    }

    public async Task<List<CategoryResponseDto>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(ToDto).ToList();
    }

    private static CategoryResponseDto ToDto(Category category)
    {
        return new CategoryResponseDto(category.Id, category.Name);
    }
}
