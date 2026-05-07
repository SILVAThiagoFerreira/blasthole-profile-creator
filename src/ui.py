from __future__ import annotations

import streamlit as st

from .config import get_default_config, load_config
from .pipeline import RenderingPipeline


def _init_state() -> None:
    st.session_state.setdefault("generated_image", None)
    st.session_state.setdefault("generated_files", {})
    st.session_state.setdefault("profile_count", int(get_default_config()["profile_count"]))


def _profile_kind_label(kind: str) -> str:
    kind = kind.lower().strip()
    if kind == "produção":
        return "Produção"
    if kind == "amortecimento":
        return "Amortecimento"
    if kind == "contorno":
        return "Contorno"
    return "Personalizado"


def _sidebar(config: dict) -> dict:
    defaults = config["defaults"]
    st.sidebar.title("Configurações")
    template_name = st.sidebar.selectbox("Template", list(config["templates"].keys()), index=list(config["templates"].keys()).index(defaults["template_name"]))
    polygon_name = st.sidebar.text_input("Nome da poligonal", value=defaults["polygon_name"])
    observation = st.sidebar.text_area("Observação final", value=defaults["observation"])

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
        "stemming": st.sidebar.text_input("Tampão / stemming", value=defaults["labels"]["stemming"]),
        "blastbag": st.sidebar.text_input("Blastbag", value=defaults["labels"]["blastbag"]),
        "airdeck": st.sidebar.text_input("Deck de ar", value=defaults["labels"]["airdeck"]),
        "column": st.sidebar.text_input("Carga / coluna", value=defaults["labels"]["column"]),
        "subdrill": st.sidebar.text_input("Subperfuração", value=defaults["labels"]["subdrill"]),
    }

    return {
        "template_name": template_name,
        "polygon_name": polygon_name,
        "observation": observation,
        "mesh_image": mesh_image,
        "labels": labels,
    }


def _profile_form(title: str, defaults: dict, prefix: str) -> dict:
    with st.expander(title, expanded=True):
        name = st.text_input("Nome do perfil", value=str(defaults.get("name", title)), key=f"{prefix}_name")
        kind = st.selectbox("Categoria visual", ["Produção", "Amortecimento", "Contorno", "Personalizado"], index=0, key=f"{prefix}_kind")
        c1, c2, c3 = st.columns(3)
        with c1:
            diametro = st.number_input("Diâmetro do furo (mm)", value=float(defaults["diametro_furo"]), step=1.0, key=f"{prefix}_diametro_furo")
            altura = st.number_input("Altura do banco (m)", value=float(defaults["altura_banco"]), step=0.05, format="%.2f", key=f"{prefix}_altura_banco")
        with c2:
            sub = st.number_input("Subperfuração (m)", value=float(defaults["subperfuracao"]), step=0.05, format="%.2f", key=f"{prefix}_subperfuracao")
            stem = st.number_input("Stemming / tampão (m)", value=float(defaults["stemming"]), step=0.05, format="%.2f", key=f"{prefix}_stemming")
        with c3:
            blastbag = st.number_input("Blastbag (m)", value=float(defaults.get("blastbag", 0.0)), step=0.05, format="%.2f", key=f"{prefix}_blastbag")
            air_deck = st.number_input("Deck de ar (m)", value=float(defaults.get("air_deck", 0.0)), step=0.05, format="%.2f", key=f"{prefix}_air_deck")
            incl = st.number_input("Inclinação (°)", value=float(defaults["inclinacao"]), step=1.0, format="%.1f", key=f"{prefix}_inclinacao")
            az = st.number_input("Azimute (°)", value=float(defaults["azimute"]), step=1.0, format="%.1f", key=f"{prefix}_azimute")
            dens = st.number_input("Densidade (g/cm³)", value=float(defaults["densidade"]), step=0.01, format="%.2f", key=f"{prefix}_densidade")

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
    pipeline = RenderingPipeline(config)
    st.set_page_config(page_title=config["app"]["title"], layout="wide", initial_sidebar_state="expanded")
    _init_state()
    st.title(config["app"]["title"])
    st.caption(config["app"]["subtitle"])

    sidebar = _sidebar(config)
    defaults = config["defaults"]["profiles"]

    profile_inputs: list[dict] = []
    for idx in range(st.session_state.profile_count):
        base = defaults[idx] if idx < len(defaults) else defaults[-1].copy()
        if idx >= len(defaults):
            base["name"] = f"Perfil {idx + 1}"
        profile_inputs.append(_profile_form(f"Configuração {idx + 1}", base, f"profile_{idx + 1}"))

    if st.button("Gerar imagem", type="primary"):
        request = {
            "polygon_name": sidebar["polygon_name"],
            "profile_type": config["app"]["default_profile_type"],
            "template_name": sidebar["template_name"],
            "observation": sidebar["observation"],
            "labels": sidebar["labels"],
            "profile_count": st.session_state.profile_count,
            "profiles": profile_inputs,
            "mesh_bytes": sidebar["mesh_image"].getvalue() if sidebar["mesh_image"] else None,
        }
        image = pipeline.build_image(request)
        st.session_state.generated_image = image
        st.session_state.generated_files = {}

    image = st.session_state.generated_image
    if image is not None:
        st.image(image, caption="Preview 3840x2160", width="stretch")
        if st.button("Exportar arquivos"):
            files = pipeline.export(image, polygon_name=sidebar["polygon_name"])
            st.session_state.generated_files = files
            manifest = pipeline.write_manifest(
                {
                    "polygon_name": sidebar["polygon_name"],
                    "template_name": sidebar["template_name"],
                    "profile_count": st.session_state.profile_count,
                    "profiles": profile_inputs,
                },
                files,
            )
            st.success(f"Manifesto salvo em {manifest}")
