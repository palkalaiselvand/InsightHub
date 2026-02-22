namespace InsightHubApi.DTOs;

public record CreateCategoryRequestDto(string Name);

public record CategoryResponseDto(string Id, string Name);
