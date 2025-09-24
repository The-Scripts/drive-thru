package com.thescripts.drive_thru_java.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
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
    @JoinColumn(
            name = "CATEGORY_FK",
            nullable = false
    )
    @ManyToOne()
    private Category category;

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

    public Product(Long id, String name, String description, Date createdAt, Date updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
