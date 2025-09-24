package com.thescripts.drive_thru_java.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
@Entity(name = "Product")
public class Product {
    @Id
    @SequenceGenerator(
            name = "product_sequence",
            sequenceName = "product_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "product_sequence"
    )
    @Column(
            updatable = false
    )
    private Long id;
    @Column(
            nullable = false
    )
    private String name;
    @Column(
            columnDefinition = "TEXT"
    )
    private String description;
    @Column(
            nullable = false
    )
    private Double price;
    @JoinColumn(
            name = "CATEGORY_FK",
            nullable = false
    )
    @ManyToOne()
    private Category category;
    @JoinColumn(
            name = "SHOP_FK"
    )
    @ManyToOne()
    private Shop shop;
    @JoinColumn(
            name = "BRAND_FK",
            nullable = false
    )
    @ManyToOne()
    private Brand brand;

    @Column(
            nullable = false,
            updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    )
    private Date createdAt;
    @LastModifiedDate
    @Column(
            nullable = false
    )
    private Date updatedAt;
}
