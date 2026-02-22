using InsightHubApi.DTOs;

namespace InsightHubApi.Services;

public interface ICategoryService
{
    Task<CategoryResponseDto> CreateAsync(CreateCategoryRequestDto request);

    Task<List<CategoryResponseDto>> GetAllAsync();
}
