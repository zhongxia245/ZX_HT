using System;
namespace Model
{
    /// <summary>
    /// TB_TABLEFIELDCONFIG:实体类(配置表模型)
    /// </summary>
    [Serializable]
    public partial class TB_TABLEFIELDCONFIG
    {
        public TB_TABLEFIELDCONFIG()
        { }
        #region Model
        private decimal _id;
        private decimal _tcid;
        private string _fcode;
        private string _fname;
        private string _ftype;
        private string _controltype;
        private string _formtype;
        private int? _colspan;
        private int? _width;
        private int? _height;
        private int? _tbsort;
        private int? _editsort;
        private string _defaultvalue;
        private string _align;
        private bool _isdisplay;
        private bool _isadd;
        private bool _isupdate;
        private bool _issearch;
        private bool _ismust;
        private bool _ispk;
        private bool _isidentity;
        private string _remark;
        private DateTime? _cteatetime;
        /// <summary>
        /// 
        /// </summary>
        public decimal ID
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 
        /// </summary>
        public decimal TCID
        {
            set { _tcid = value; }
            get { return _tcid; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string FCODE
        {
            set { _fcode = value; }
            get { return _fcode; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string FNAME
        {
            set { _fname = value; }
            get { return _fname; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string FTYPE
        {
            set { _ftype = value; }
            get { return _ftype; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string CONTROLTYPE
        {
            set { _controltype = value; }
            get { return _controltype; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string FORMTYPE
        {
            set { _formtype = value; }
            get { return _formtype; }
        }
        /// <summary>
        /// 
        /// </summary>
        public int? COLSPAN
        {
            set { _colspan = value; }
            get { return _colspan; }
        }
        /// <summary>
        /// 
        /// </summary>
        public int? WIDTH
        {
            set { _width = value; }
            get { return _width; }
        }
        /// <summary>
        /// 
        /// </summary>
        public int? HEIGHT
        {
            set { _height = value; }
            get { return _height; }
        }
        /// <summary>
        /// 
        /// </summary>
        public int? TBSORT
        {
            set { _tbsort = value; }
            get { return _tbsort; }
        }
        /// <summary>
        /// 
        /// </summary>
        public int? EDITSORT
        {
            set { _editsort = value; }
            get { return _editsort; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string DEFAULTVALUE
        {
            set { _defaultvalue = value; }
            get { return _defaultvalue; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string ALIGN
        {
            set { _align = value; }
            get { return _align; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool ISDISPLAY
        {
            set { _isdisplay = value; }
            get { return _isdisplay; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool ISADD
        {
            set { _isadd = value; }
            get { return _isadd; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool ISUPDATE
        {
            set { _isupdate = value; }
            get { return _isupdate; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool ISSEARCH
        {
            set { _issearch = value; }
            get { return _issearch; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool ISMUST
        {
            set { _ismust = value; }
            get { return _ismust; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool ISPK
        {
            set { _ispk = value; }
            get { return _ispk; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool ISIDENTITY
        {
            set { _isidentity = value; }
            get { return _isidentity; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string REMARK
        {
            set { _remark = value; }
            get { return _remark; }
        }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? CTEATETIME
        {
            set { _cteatetime = value; }
            get { return _cteatetime; }
        }
        #endregion Model

    }
}

