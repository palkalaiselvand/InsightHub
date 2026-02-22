using InsightHubApi.DTOs;

namespace InsightHubApi.Services;

public interface IPostService
{
    Task<PostResponseDto> CreateAsync(CreatePostRequestDto request);

    Task<PostResponseDto?> GetByIdAsync(string id);

    Task<List<PostResponseDto>> GetAllAsync();

    Task<PostResponseDto?> UpdateAsync(string id, UpdatePostRequestDto request);

    Task<bool> DeleteAsync(string id);
}
