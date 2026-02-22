namespace InsightHubApi.DTOs;

public record RegisterRequestDto(string Name, string Email, string Password, string Role = "Reader");

public record LoginRequestDto(string Email, string Password);

public record UserResponseDto(string Id, string Name, string Email, string Role, DateTime CreatedAt);

public record LoginResponseDto(UserResponseDto User, string Message);
