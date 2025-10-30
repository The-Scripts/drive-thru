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
}
