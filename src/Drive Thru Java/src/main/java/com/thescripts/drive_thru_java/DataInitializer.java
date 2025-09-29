package com.thescripts.drive_thru_java;

import com.thescripts.drive_thru_java.entity.Product;
import com.thescripts.drive_thru_java.entity.Shop;
import com.thescripts.drive_thru_java.entity.Brand;
import com.thescripts.drive_thru_java.entity.Category;
import com.thescripts.drive_thru_java.entity.User;
import com.thescripts.drive_thru_java.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;


@Component
public class DataInitializer {
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;

    public DataInitializer(BrandRepository brandRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository,
                           ShopRepository shopRepository) {
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
    }

    @PostConstruct
    public void initData() {
        if (brandRepository.count() == 0) {
            java.sql.Date now = new java.sql.Date(System.currentTimeMillis());

            // Create Categories
            Category beverages = new Category();
            beverages.setName("Beverages");
            beverages.setCreatedAt(now);
            beverages.setUpdatedAt(now);
            categoryRepository.save(beverages);

            Category snacks = new Category();
            snacks.setName("Snacks");
            snacks.setCreatedAt(now);
            snacks.setUpdatedAt(now);
            categoryRepository.save(snacks);

            // Create Brands
            Brand starbucks = new Brand();
            starbucks.setName("Starbucks");
            starbucks.setDescription("Coffee chain and coffeehouse");
            starbucks.setImageUrl("https://example.com/starbucks-logo.png");
            starbucks.setCreatedAt(now);
            starbucks.setUpdatedAt(now);
            brandRepository.save(starbucks);

            Brand mcdonalds = new Brand();
            mcdonalds.setName("McDonald's");
            mcdonalds.setDescription("Fast food restaurant chain");
            mcdonalds.setImageUrl("https://example.com/mcdonalds-logo.png");
            mcdonalds.setCreatedAt(now);
            mcdonalds.setUpdatedAt(now);
            brandRepository.save(mcdonalds);

            // Create Shops
            Shop starbucksShop = new Shop();
            starbucksShop.setBrandId(starbucks);
            shopRepository.save(starbucksShop);

            Shop mcdonaldsShop = new Shop();
            mcdonaldsShop.setBrandId(mcdonalds);
            shopRepository.save(mcdonaldsShop);

            // Create Products
            Product latte = new Product();
            latte.setName("Caffe Latte");
            latte.setDescription("Rich espresso with steamed milk");
            latte.setPrice(4.95);
            latte.setBrand(starbucks);
            latte.setCategory(beverages);
            latte.setShop(starbucksShop);
            latte.setCreatedAt(now);
            latte.setUpdatedAt(now);
            productRepository.save(latte);

            Product bigMac = new Product();
            bigMac.setName("Big Mac");
            bigMac.setDescription("Two all-beef patties, special sauce, lettuce, cheese");
            bigMac.setPrice(5.99);
            bigMac.setBrand(mcdonalds);
            bigMac.setCategory(snacks);
            bigMac.setShop(mcdonaldsShop);
            bigMac.setCreatedAt(now);
            bigMac.setUpdatedAt(now);
            productRepository.save(bigMac);

            // Create Users
            User user1 = new User();
            user1.setFirstName("John");
            user1.setLastName("Doe");
            user1.setEmail("john.doe@example.com");
            user1.setCreatedAt(now);
            user1.setUpdatedAt(now);
            userRepository.save(user1);
        }
    }
}
