namespace InsightHubApi.DTOs;

public record CreatePostRequestDto(
    string Title,
    string Content,
    string CategoryId,
    string AuthorId,
    string Status = "Draft"
);

public record UpdatePostRequestDto(
    string Title,
    string Content,
    string CategoryId,
    string Status = "Draft"
);

public record PostResponseDto(
    string Id,
    string Title,
    string Content,
    string CategoryId,
    string AuthorId,
    string Status,
    DateTime CreatedAt
);

public record ReaderPostDto(
    string Id,
    string Title,
    string Content,
    string CategoryId,
    string CategoryName,
    string AuthorId,
    string AuthorName,
    string Status,
    DateTime CreatedAt
);
