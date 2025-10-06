package com.thescripts.drive_thru_java.controller;

import com.thescripts.drive_thru_java.DriveThruJavaApplication;
import com.thescripts.drive_thru_java.entity.Brand;
import com.thescripts.drive_thru_java.entity.Category;
import com.thescripts.drive_thru_java.entity.Product;
import com.thescripts.drive_thru_java.repository.BrandRepository;
import com.thescripts.drive_thru_java.repository.CategoryRepository;
import com.thescripts.drive_thru_java.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.MOCK,
        classes = DriveThruJavaApplication.class
)
@AutoConfigureMockMvc
@TestPropertySource(
        locations = "classpath:application-integration.properties"
)
@org.springframework.test.context.ActiveProfiles("integration")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class ProductControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    private void createTestProduct() {
        // Create a test category
        Category category = new Category();
        category.setName("Test Category");
        category.setCreatedAt(new Date(System.currentTimeMillis()));
        category.setUpdatedAt(new Date(System.currentTimeMillis()));
        category = categoryRepository.save(category);

        // Create a test brand
        Brand brand = new Brand();
        brand.setName("Test Brand");
        brand.setDescription("Test brand description");
        brand.setImageUrl("https://example.com/brand-image.jpg");
        brand.setCreatedAt(new Date(System.currentTimeMillis()));
        brand.setUpdatedAt(new Date(System.currentTimeMillis()));
        brand = brandRepository.save(brand);

        // Create a test product
        Product product = new Product();
        product.setName("Test Product");
        product.setDescription("This is a test product description");
        product.setPrice(29.99);
        product.setCategory(category);
        product.setBrand(brand);
        product.setCreatedAt(new Date(System.currentTimeMillis()));
        product.setUpdatedAt(new Date(System.currentTimeMillis()));

        productRepository.save(product);
    }

    @Test
    @Transactional
    public void givenAllProducts_whenFindAllProducts_thenReturnProductList() throws Exception {
        createTestProduct();

        mockMvc.perform(get("/api/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].name").value("Test Product"))
                .andExpect(jsonPath("$[0].description").value("This is a test product description"))
                .andExpect(jsonPath("$[0].price").value(29.99))
                .andExpect(jsonPath("$[0].category").exists())
                .andExpect(jsonPath("$[0].category.id").exists())
                .andExpect(jsonPath("$[0].category.name").value("Test Category"))
                .andExpect(jsonPath("$[0].brand").exists())
                .andExpect(jsonPath("$[0].brand.id").exists())
                .andExpect(jsonPath("$[0].brand.name").value("Test Brand"))
                .andExpect(jsonPath("$[0].brand.description").value("Test brand description"))
                .andExpect(jsonPath("$[0].brand.imageUrl").value("https://example.com/brand-image.jpg"))
                .andExpect(jsonPath("$[0].createdAt").exists())
                .andExpect(jsonPath("$[0].updatedAt").exists());
    }
}
