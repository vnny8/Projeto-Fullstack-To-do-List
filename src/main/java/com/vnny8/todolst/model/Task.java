package com.vnny8.todolst.model;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "tarefas")
@Setter
@Getter
@ToString
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable=false)
    private String titulo;

    @Column(nullable=false)
    private String descricao;

    @Column(nullable = false)
    private LocalDateTime prazoFinal;

    @CreationTimestamp
    @Column(name = "Criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name= "Atualizado_em")
    private LocalDateTime atualizadoEm;

}
