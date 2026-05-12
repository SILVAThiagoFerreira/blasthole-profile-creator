from __future__ import annotations

import io
from pathlib import Path
from typing import Any

import streamlit as st

from .config import get_default_config, load_config
from .pipeline import RenderingPipeline
from .preferences import load_ui_preferences, save_ui_preferences


def _init_state(preferences: dict[str, Any]) -> None:
    st.session_state.setdefault("generated_image", None)
    st.session_state.setdefault("generated_files", {})
    st.session_state.setdefault("generated_manifest", None)
    st.session_state.setdefault("profile_count", int(preferences["profile_count"]))
    st.session_state.setdefault("template_name", preferences["template_name"])
    st.session_state.setdefault("polygon_name", preferences["polygon_name"])
    st.session_state.setdefault("observation", preferences["observation"])

    for label_key, label_value in preferences["labels"].items():
        st.session_state.setdefault(f"label_{label_key}", label_value)

    for idx, profile in enumerate(preferences["profiles"], start=1):
        prefix = f"profile_{idx}"
        st.session_state.setdefault(f"{prefix}_name", profile["name"])
        st.session_state.setdefault(f"{prefix}_kind", _profile_kind_label(profile["kind"]))
        st.session_state.setdefault(f"{prefix}_diametro_furo", float(profile["diametro_furo"]))
        st.session_state.setdefault(f"{prefix}_altura_banco", float(profile["altura_banco"]))
        st.session_state.setdefault(f"{prefix}_subperfuracao", float(profile["subperfuracao"]))
        st.session_state.setdefault(f"{prefix}_stemming", float(profile["stemming"]))
        st.session_state.setdefault(f"{prefix}_blastbag", float(profile.get("blastbag", 0.0)))
        st.session_state.setdefault(f"{prefix}_air_deck", float(profile.get("air_deck", 0.0)))
        st.session_state.setdefault(f"{prefix}_inclinacao", float(profile["inclinacao"]))
        st.session_state.setdefault(f"{prefix}_azimute", float(profile["azimute"]))
        st.session_state.setdefault(f"{prefix}_densidade", float(profile["densidade"]))


def _profile_kind_label(kind: str) -> str:
    kind = kind.lower().strip()
    if kind == "produção":
        return "Produção"
    if kind == "amortecimento":
        return "Amortecimento"
    if kind == "contorno":
        return "Contorno"
    return "Personalizado"


def _select_index(options: list[str], current: str) -> int:
    return options.index(current) if current in options else 0


def _sidebar(config: dict) -> dict:
    st.sidebar.title("Configurações")
    template_options = list(config["templates"].keys())
    template_name = st.sidebar.selectbox("Template", template_options, index=_select_index(template_options, st.session_state.get("template_name", template_options[0])), key="template_name")
    polygon_name = st.sidebar.text_input("Nome da poligonal", value=st.session_state.get("polygon_name", ""), key="polygon_name")
    observation = st.sidebar.text_area("Observação final", value=st.session_state.get("observation", ""), key="observation")

    st.sidebar.subheader("Perfis")
    cols = st.sidebar.columns(2)
    with cols[0]:
        if st.button("+ Adicionar", use_container_width=True):
            st.session_state.profile_count = min(config["validation"]["max_profiles"], st.session_state.profile_count + 1)
            st.rerun()
    with cols[1]:
        if st.button("- Remover", use_container_width=True):
            st.session_state.profile_count = max(config["validation"]["min_profiles"], st.session_state.profile_count - 1)
            st.rerun()

    mesh_image = st.sidebar.file_uploader("Anexar imagem da malha", type=["png", "jpg", "jpeg"], help="Opcional. Se não anexar, será exibido um painel técnico de referência.")

    st.sidebar.subheader("Terminologia editável")
    labels = {
        "stemming": st.sidebar.text_input("Tampão / stemming", value=st.session_state.get("label_stemming", ""), key="label_stemming"),
        "blastbag": st.sidebar.text_input("Blastbag", value=st.session_state.get("label_blastbag", ""), key="label_blastbag"),
        "airdeck": st.sidebar.text_input("Deck de ar", value=st.session_state.get("label_airdeck", ""), key="label_airdeck"),
        "column": st.sidebar.text_input("Carga / coluna", value=st.session_state.get("label_column", ""), key="label_column"),
        "subdrill": st.sidebar.text_input("Subperfuração", value=st.session_state.get("label_subdrill", ""), key="label_subdrill"),
    }

    return {
        "template_name": template_name,
        "polygon_name": polygon_name,
        "observation": observation,
        "mesh_image": mesh_image,
        "labels": labels,
    }


def _image_bytes(image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def _download_artifact(label: str, path: str, file_name: str, mime: str) -> None:
    file_path = Path(path)
    if file_path.exists():
        st.download_button(label, data=file_path.read_bytes(), file_name=file_name, mime=mime, use_container_width=True)


def _build_request(config: dict[str, Any], sidebar: dict[str, Any], profile_inputs: list[dict[str, Any]], profile_count: int) -> dict[str, Any]:
    return {
        "polygon_name": sidebar["polygon_name"],
        "profile_type": config["app"]["default_profile_type"],
        "template_name": sidebar["template_name"],
        "observation": sidebar["observation"],
        "labels": sidebar["labels"],
        "profile_count": profile_count,
        "profiles": profile_inputs,
        "mesh_bytes": sidebar["mesh_image"].getvalue() if sidebar["mesh_image"] else None,
    }


def _render_hero(config: dict) -> None:
    st.markdown(
        f"""
        <div style="padding: 1.2rem 0 0.4rem 0;">
          <div style="font-size: 0.9rem; font-weight: 700; letter-spacing: 0.08em; color: #D71920; text-transform: uppercase;">SaaS industrial</div>
          <h1 style="margin: 0.2rem 0 0 0; font-size: 2.3rem; line-height: 1.05;">{config['app']['title']}</h1>
          <p style="max-width: 840px; font-size: 1.02rem; color: #475467; margin-top: 0.65rem;">{config['app']['subtitle']} Agora em formato web, pronto para uso remoto, geração auditável e download imediato.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    c1, c2, c3 = st.columns(3)
    c1.metric("Modo", "Web SaaS", "Acesso online")
    c2.metric("Saída", "PNG / JPG / PDF", "Exportação automática")
    c3.metric("Rastreabilidade", "Manifesto", "Por execução")


def _render_pricing() -> None:
    st.subheader("Planos")
    c1, c2, c3 = st.columns(3)
    with c1:
        with st.container(border=True):
            st.markdown("**Starter**\n\n- 1 usuário\n- Geração de perfis\n- Exportação básica")
    with c2:
        with st.container(border=True):
            st.markdown("**Pro**\n\n- Equipe\n- Templates visuais\n- Manifesto e downloads")
    with c3:
        with st.container(border=True):
            st.markdown("**Enterprise**\n\n- Branding próprio\n- Hospedagem dedicada\n- Integração com fluxo interno")


def _render_how_it_works() -> None:
    st.subheader("Como funciona")
    st.write("1. Preencha a poligonal e os perfis técnicos.")
    st.write("2. Gere a lâmina no navegador.")
    st.write("3. Baixe os arquivos e o manifesto da execução.")
    st.write("4. Hospede o app online e compartilhe o link com a equipe.")


def _profile_form(title: str, defaults: dict, prefix: str) -> dict:
    with st.expander(title, expanded=True):
        name_key = f"{prefix}_name"
        kind_key = f"{prefix}_kind"
        kind_options = ["Produção", "Amortecimento", "Contorno", "Personalizado"]

        name = st.text_input("Nome do perfil", value=str(st.session_state.get(name_key, defaults.get("name", title))), key=name_key)
        kind = st.selectbox(
            "Categoria visual",
            kind_options,
            index=_select_index(kind_options, st.session_state.get(kind_key, _profile_kind_label(str(defaults.get("kind", ""))))),
            key=kind_key,
        )
        c1, c2, c3 = st.columns(3)
        with c1:
            diametro_key = f"{prefix}_diametro_furo"
            altura_key = f"{prefix}_altura_banco"
            diametro = st.number_input("Diâmetro do furo (mm)", value=float(st.session_state.get(diametro_key, defaults["diametro_furo"])), step=1.0, key=diametro_key)
            altura = st.number_input("Altura do banco (m)", value=float(st.session_state.get(altura_key, defaults["altura_banco"])), step=0.05, format="%.2f", key=altura_key)
        with c2:
            sub_key = f"{prefix}_subperfuracao"
            stem_key = f"{prefix}_stemming"
            sub = st.number_input("Subperfuração (m)", value=float(st.session_state.get(sub_key, defaults["subperfuracao"])), step=0.05, format="%.2f", key=sub_key)
            stem = st.number_input("Stemming / tampão (m)", value=float(st.session_state.get(stem_key, defaults["stemming"])), step=0.05, format="%.2f", key=stem_key)
        with c3:
            blastbag_key = f"{prefix}_blastbag"
            air_deck_key = f"{prefix}_air_deck"
            incl_key = f"{prefix}_inclinacao"
            az_key = f"{prefix}_azimute"
            dens_key = f"{prefix}_densidade"
            blastbag = st.number_input("Blastbag (m)", value=float(st.session_state.get(blastbag_key, defaults.get("blastbag", 0.0))), step=0.05, format="%.2f", key=blastbag_key)
            air_deck = st.number_input("Deck de ar (m)", value=float(st.session_state.get(air_deck_key, defaults.get("air_deck", 0.0))), step=0.05, format="%.2f", key=air_deck_key)
            incl = st.number_input("Inclinação (°)", value=float(st.session_state.get(incl_key, defaults["inclinacao"])), step=1.0, format="%.1f", key=incl_key)
            az = st.number_input("Azimute (°)", value=float(st.session_state.get(az_key, defaults["azimute"])), step=1.0, format="%.1f", key=az_key)
            dens = st.number_input("Densidade (g/cm³)", value=float(st.session_state.get(dens_key, defaults["densidade"])), step=0.01, format="%.2f", key=dens_key)

    return {
        "name": name,
        "kind": _profile_kind_label(kind),
        "diametro_furo": diametro,
        "altura_banco": altura,
        "subperfuracao": sub,
        "stemming": stem,
        "blastbag": blastbag,
        "air_deck": air_deck,
        "inclinacao": incl,
        "azimute": az,
        "densidade": dens,
    }


def run_app() -> None:
    config = load_config()
    preferences = load_ui_preferences(config)
    pipeline = RenderingPipeline(config)
    st.set_page_config(page_title=config["app"]["title"], layout="wide", initial_sidebar_state="expanded")
    _init_state(preferences)
    _render_hero(config)

    top_tabs = st.tabs(["Criar perfil", "Planos", "Como funciona"])

    with top_tabs[1]:
        _render_pricing()

    with top_tabs[2]:
        _render_how_it_works()

    with top_tabs[0]:
        sidebar = _sidebar(config)
        defaults = config["defaults"]["profiles"]

        profile_inputs: list[dict] = []
        for idx in range(st.session_state.profile_count):
            base = defaults[idx] if idx < len(defaults) else defaults[-1].copy()
            if idx >= len(defaults):
                base["name"] = f"Perfil {idx + 1}"
            profile_inputs.append(_profile_form(f"Configuração {idx + 1}", base, f"profile_{idx + 1}"))

        if st.button("Gerar e salvar", type="primary"):
            request = _build_request(config, sidebar, profile_inputs, st.session_state.profile_count)
            image = pipeline.build_image(request)
            files = pipeline.export(image, polygon_name=sidebar["polygon_name"])
            manifest = pipeline.write_manifest(
                {
                    "polygon_name": sidebar["polygon_name"],
                    "template_name": sidebar["template_name"],
                    "profile_count": st.session_state.profile_count,
                    "profiles": profile_inputs,
                },
                files,
            )
            st.session_state.generated_image = image
            st.session_state.generated_files = files
            st.session_state.generated_manifest = str(manifest)
            try:
                save_ui_preferences(config, request)
            except OSError as exc:
                st.warning(f"Não foi possível salvar as preferências: {exc}")
            st.caption("As últimas configurações válidas ficam salvas para a próxima abertura.")

        image = st.session_state.generated_image
        if image is not None:
            st.success("Lâmina gerada com sucesso.")
            st.image(image, caption="Preview 3840x2160", width="stretch")

            download_cols = st.columns(4)
            with download_cols[0]:
                st.download_button("Baixar PNG", data=_image_bytes(image), file_name="perfil_carga.png", mime="image/png", use_container_width=True)
            with download_cols[1]:
                png_path = st.session_state.generated_files.get("png")
                if png_path:
                    _download_artifact("Baixar arquivo PNG", png_path, Path(png_path).name, "image/png")
            with download_cols[2]:
                jpg_path = st.session_state.generated_files.get("jpg")
                if jpg_path:
                    _download_artifact("Baixar arquivo JPG", jpg_path, Path(jpg_path).name, "image/jpeg")
            with download_cols[3]:
                pdf_path = st.session_state.generated_files.get("pdf")
                if pdf_path:
                    _download_artifact("Baixar arquivo PDF", pdf_path, Path(pdf_path).name, "application/pdf")

            if st.session_state.generated_manifest:
                st.caption(f"Manifesto salvo em {st.session_state.generated_manifest}")
