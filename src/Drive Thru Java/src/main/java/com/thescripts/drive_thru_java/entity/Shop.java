package com.thescripts.drive_thru_java.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "Shop")
@Table(name = "shops")
public class Shop {
    @Id
    @SequenceGenerator(
            name = "shop_sequence",
            sequenceName = "shop_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = jakarta.persistence.GenerationType.SEQUENCE,
            generator = "shop_sequence"
    )
    @Column(
            updatable = false
    )
    private Long id;
    @JoinColumn(
            name = "BRAND_FK",
            nullable = false
    )
    @ManyToOne()
    private Brand brandId;
}
