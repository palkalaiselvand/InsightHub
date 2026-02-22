using InsightHubApi.DTOs;

namespace InsightHubApi.Services;

public interface IAuthService
{
    Task<UserResponseDto> RegisterAsync(RegisterRequestDto request);

    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);

    Task<List<UserResponseDto>> GetUsersAsync();
}
