# Demand Engine — Visión del producto

Documento canónico de producto. Toda decisión de producto debe alinearse aquí.

## Objetivo

Construir una plataforma que genere demanda activa para propiedades de renta corta, capturando viajeros antes de Airbnb y dirigiéndolos a los anuncios propios.

## Filosofía

La plataforma **no** es administrador de propiedades, PMS, channel manager ni gestor de reservas.

Su única misión: **generar más noches reservadas**.

Cada funcionalidad debe responder: ¿esto ayuda a conseguir más reservas?

## Principios

1. **El contexto vende más que el departamento** — la necesidad es el producto.
2. **No vendemos alojamiento; vendemos experiencias.**
3. **Cada departamento tiene múltiples públicos** → landings, ads y mensajes distintos.
4. **Las campañas siguen la demanda** — nacen con la oportunidad y mueren con ella.
5. **Todo debe poder automatizarse** — la IA propone; el usuario supervisa.

## Arquitectura conceptual

Departamento → POIs → Motivos de viaje → Eventos/estacionalidad → Intención → Landing → SEO/Ads → Reserva Airbnb

## Núcleo de datos

Propiedades, POIs, Eventos, Intenciones (+ Campañas y Oportunidades como capas operativas).

## Escalabilidad

Hoy: propiedades propias. Mañana: SaaS sin reescribir el núcleo.
