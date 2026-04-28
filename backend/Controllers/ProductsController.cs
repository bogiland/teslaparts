using Microsoft.AspNetCore.Mvc;
using TeslaStore.Attributes;
using TeslaStore.BLL.DTOs;
using TeslaStore.BLL.Services;
using TeslaStore.Constants;

namespace TeslaStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public IActionResult GetProducts()
        {
            var products = _productService.GetAllProducts();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            var product = _productService.GetProductById(id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost]
        [AdminMod(RoleNames.Admin)]
        public IActionResult CreateProduct([FromBody] ProductDTO productDto)
        {
            try
            {
                var createdProduct = _productService.CreateProduct(productDto);
                return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [AdminMod(RoleNames.Admin)]
        public IActionResult UpdateProduct(int id, [FromBody] ProductDTO productDto)
        {
            try
            {
                _productService.UpdateProduct(id, productDto);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("{id}")]
        [AdminMod(RoleNames.Admin)]
        public IActionResult DeleteProduct(int id)
        {
            try
            {
                _productService.DeleteProduct(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                            return NotFound();

            }
        }
    }
}
