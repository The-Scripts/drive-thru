package com.thescripts.drive_thru_java.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;

import java.awt.print.Book;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "Brand")
@Table(name = "brands")
public class Brand {
    @Id
    @SequenceGenerator(
            name = "brand_sequence",
            sequenceName = "brand_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "brand_sequence"
    )
    @Column(
            updatable = false
    )
    private Long id;
    @Column(
            nullable = false,
            unique = true
    )
    private String name;
    @Column(
            columnDefinition = "TEXT"
    )
    private String description;
    private String imageUrl;
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

    public Brand(String name, String description, String imageUrl, Long id) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.id = id;
    }
}
