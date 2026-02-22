using InsightHubApi.DTOs;
using InsightHubApi.Models;
using InsightHubApi.Repositories;

namespace InsightHubApi.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            throw new InvalidOperationException("Email is already registered.");
        }

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };

        var created = await _userRepository.CreateAsync(user);
        return ToUserDto(created);
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email.Trim());
        if (user is null)
        {
            return null;
        }

        var isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isValidPassword)
        {
            return null;
        }

        return new LoginResponseDto(ToUserDto(user), "Login successful.");
    }

    public async Task<List<UserResponseDto>> GetUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(ToUserDto).ToList();
    }

    private static UserResponseDto ToUserDto(User user)
    {
        return new UserResponseDto(user.Id, user.Name, user.Email, user.Role, user.CreatedAt);
    }
}
