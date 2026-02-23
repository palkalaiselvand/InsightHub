using InsightHubApi.DTOs;
using InsightHubApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace InsightHubApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    [HttpPost]
    public async Task<ActionResult<PostResponseDto>> Create([FromBody] CreatePostRequestDto request)
    {
        var created = await _postService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PostResponseDto>> Update(string id, [FromBody] UpdatePostRequestDto request)
    {
        var updated = await _postService.UpdateAsync(id, request);
        if (updated is null)
        {
            return NotFound(new { message = "Post not found." });
        }

        return Ok(updated);
    }

    [HttpGet]
    public async Task<ActionResult<List<PostResponseDto>>> GetAll()
    {
        var posts = await _postService.GetAllAsync();
        return Ok(posts);
    }

    [HttpGet("published")]
    public async Task<ActionResult<object>> GetPublished([FromQuery] string? categoryId = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 6)
    {
        var posts = await _postService.GetPublishedAsync(categoryId);
        var paged = posts.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        var totalPages = (int)Math.Ceiling(posts.Count / (double)pageSize);
        return Ok(new { posts = paged, totalPages });
    }

    [HttpGet("published/{id}")]
    public async Task<ActionResult<ReaderPostDto>> GetPublishedById(string id)
    {
        var post = await _postService.GetPublishedByIdAsync(id);
        if (post is null)
        {
            return NotFound(new { message = "Published post not found." });
        }

        return Ok(post);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostResponseDto>> GetById(string id)
    {
        var post = await _postService.GetByIdAsync(id);
        if (post is null)
        {
            return NotFound(new { message = "Post not found." });
        }

        return Ok(post);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _postService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = "Post not found." });
        }

        return NoContent();
    }
}
