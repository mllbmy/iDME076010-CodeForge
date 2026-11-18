# -*- coding: utf-8 -*-
"""生成《项目简介》DOCX。"""
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

BODY_FONT = "宋体"
HEAD_FONT = "微软雅黑"
ASCII_FONT = "Times New Roman"


def set_run(run, size=10.5, bold=False, eastasia=BODY_FONT, color=None):
    run.font.name = ASCII_FONT
    run.font.size = Pt(size)
    run.bold = bold
    if color is not None:
        run.font.color.rgb = color
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.get_or_add_rFonts()
    rFonts.set(qn("w:eastAsia"), eastasia)
    rFonts.set(qn("w:ascii"), ASCII_FONT)
    rFonts.set(qn("w:hAnsi"), ASCII_FONT)


def shade(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)


def add_table(doc, headers, rows, widths):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    hdr = t.rows[0]
    for i, h in enumerate(headers):
        p = hdr.cells[i].paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        set_run(p.add_run(h), size=10, bold=True, eastasia=HEAD_FONT)
        shade(hdr.cells[i], "D9E2F3")
    for r in rows:
        cells = t.add_row().cells
        for i, v in enumerate(r):
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            set_run(p.add_run(str(v)), size=10)
    for row in t.rows:
        for i, w in enumerate(widths):
            row.cells[i].width = Cm(w)
    return t


def caption(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(6)
    set_run(p.add_run(text), size=9, eastasia=HEAD_FONT, color=RGBColor(0x59, 0x59, 0x59))


doc = Document()

# 页面 A4
sec = doc.sections[0]
sec.page_width = Cm(21.0)
sec.page_height = Cm(29.7)
sec.left_margin = Cm(2.8)
sec.right_margin = Cm(2.8)
sec.top_margin = Cm(2.54)
sec.bottom_margin = Cm(2.54)

# 正文样式
normal = doc.styles["Normal"]
normal.font.name = ASCII_FONT
normal.font.size = Pt(10.5)
normal.element.rPr.rFonts.set(qn("w:eastAsia"), BODY_FONT)
normal.paragraph_format.line_spacing = 1.5
normal.paragraph_format.space_after = Pt(0)

# 标题
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
title.paragraph_format.space_after = Pt(2)
set_run(title.add_run("「智」造未来——工业智造管理系统"), size=20, bold=True, eastasia=HEAD_FONT)

sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
sub.paragraph_format.space_after = Pt(14)
set_run(sub.add_run("项 目 简 介"), size=12, eastasia=HEAD_FONT,
        color=RGBColor(0x40, 0x40, 0x40))


def heading(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(6)
    set_run(p.add_run(text), size=13, bold=True, eastasia=HEAD_FONT,
            color=RGBColor(0x1F, 0x3A, 0x5F))


def body(text, indent=True):
    p = doc.add_paragraph()
    if indent:
        p.paragraph_format.first_line_indent = Pt(21)
    p.paragraph_format.space_after = Pt(3)
    set_run(p.add_run(text), size=10.5)


def bullet(text):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(2)
    set_run(p.add_run(text), size=10.5)


# 一、项目概况
heading("一、项目概况")
body("本项目采用前后端分离架构：前端基于 React 18、TypeScript、Ant Design 与 ECharts 实现交互界面与可视化图表，后端基于 Spring Boot 3.0 与 JDK 17 提供 RESTful 接口，数据底座使用华为工业数字模型驱动引擎（iDME）与 xDM-F 完成设备、物料、工序、工艺路线四类核心数据的统一建模；在此基础上实现了设备台账与保养维修、物料 BOM 与库存版本管理、标准工序库与工艺路线可视化编排、生产可视化大屏、AI 实时监控预警以及多维报表分析等功能，打通了从基础数据维护到工艺过程管理的数字化闭环。")
body("作品面向精密行星减速器等多品种、小批量、高精度制造场景，服务于工艺设计、设备运维与生产管理等多角色协同作业。")
body("系统以「设备—物料—工序—工艺路线」四类核心生产要素为主线，通过统一的模型化建模将生产资源结构化、可配置、可追溯，帮助制造企业解决工艺标准不统一、数据分散、协同效率低的问题。")
caption(doc, "表 1  项目基本信息")
add_table(doc,
    ["项目", "内容"],
    [
        ["作品名称", "「智」造未来——工业智造管理系统"],
        ["团队编号 / 团队名称", "iDME076010 / CodeForge"],
        ["参赛赛项", "工业 miniAPP 开发赛项"],
        ["技术底座", "华为 iDME + xDM-F 数据建模引擎"],
        ["目标场景", "精密行星减速器制造的工艺与生产资源管理"],
        ["系统形态", "B/S 架构 Web 系统，可打包为桌面客户端"],
    ],
    [4.6, 10.6])

# 二、项目背景
heading("二、项目背景")
body("精密制造现场的设备、物料与工艺信息往往分散在台账表格和线下流程中，工艺变更依赖人工传递，版本难以收敛，追溯成本高。传统管理方式普遍存在「局部可控、整体难调」的问题。")
body("本项目将上述要素纳入统一的数据底座：以设备台账掌握资源状态，以物料 BOM 表达产品结构，以标准工序与工艺路线固化制造过程，使工艺知识沉淀为可复用、可迭代的数字资产，并为后续的产能分析与持续优化提供数据基础。")

# 三、系统功能
heading("三、系统功能")
body("系统划分为六个功能模块，覆盖从总览监控到明细维护的完整链路。")
caption(doc, "表 2  功能模块一览")
add_table(doc,
    ["功能模块", "主要能力"],
    [
        ["智能大屏", "关键指标、产能对比与设备状态可视化总览"],
        ["AI 智能中心", "设备运行实时监控、异常预警与处理建议"],
        ["设备管理", "设备台账、保养记录、维修记录、折旧与设备类型管理"],
        ["物料管理", "物料台账、BOM 结构维护、库存出入库与版本管理"],
        ["工序及工艺", "标准工序库、工艺路线可视化编排、工艺参数配置"],
        ["报表分析", "设备、保养、维修与成本的多维统计与趋势分析"],
    ],
    [4.6, 10.6])

# 四、技术架构
heading("四、技术架构")
body("系统采用前后端分离架构：前端负责交互与可视化，后端提供 RESTful 接口并封装数据底座访问，数据模型统一由 iDME/xDM-F 建模与映射。")
caption(doc, "表 3  技术选型")
add_table(doc,
    ["层次", "技术选型", "说明"],
    [
        ["前端", "React 18、TypeScript、Vite 5、Ant Design 5、ECharts、Zustand", "单页应用，支持 Mock / Real 双数据模式切换"],
        ["后端", "Spring Boot 3.0、JDK 17、JWT、Swagger", "RESTful 接口服务，统一异常处理与接口文档"],
        ["数据底座", "华为 iDME / xDM-F", "数据实体建模、实体服务与关系服务"],
        ["部署", "前后端分离，后端可托管前端静态资源", "浏览器访问，另支持 Electron 桌面端打包"],
    ],
    [3.2, 7.6, 4.4])

# 五、核心数据模型
heading("五、核心数据模型")
body("数据模型在 iDME 平台完成建模并发布，主要实体如下。物料采用版本对象模型，支持主对象、分支对象与版本演进，满足工程变更场景。")
caption(doc, "表 4  核心数据实体")
add_table(doc,
    ["数据实体", "中文名称", "说明"],
    [
        ["Equipment", "设备管理", "设备台账主数据，含编码、类型、折旧方式等属性"],
        ["Part / PartMaster / PartBranch", "物料", "版本对象模型，支持主/分支对象与版本管理"],
        ["WorkingPlan", "工艺", "工艺路线主数据"],
        ["WorkingProcedure", "工序", "标准工序主数据"],
        ["Bom_relation", "BOM 关系", "物料父子结构的多对多关系实体"],
    ],
    [5.4, 3.4, 6.4])

# 六、运行说明
heading("六、运行说明")
bullet("环境要求：JDK 17 及以上、Node.js 18 及以上、pnpm。")
bullet("后端：Maven 打包后以 java -jar 启动，默认端口 8080，接口前缀为 /api。")
bullet("前端：安装依赖后以 pnpm dev 启动，默认端口 3000。")
bullet("访问地址：页面 http://localhost:3000；接口文档 http://localhost:8080/api/swagger-ui/index.html。")
bullet("数据模式：演示环境使用内置 Mock 数据；接入真实数据需部署 iDME 服务代理并配置访问凭据。")

out = r"D:\比赛\高交会\iDME076010-CodeForge-“智”造未来-工业智造管理系统\项目简介-工业智造管理系统.docx"
doc.save(out)
print("SAVED:", out)
