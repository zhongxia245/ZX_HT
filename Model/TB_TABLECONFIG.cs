using System;
namespace Model
{
	/// <summary>
	/// TB_TABLECONFIG:实体类(主表模型)
	/// </summary>
	[Serializable]
	public partial class TB_TABLECONFIG
	{
		public TB_TABLECONFIG()
		{}
		#region Model
		private decimal _id;
		private string _dbname;
		private string _tbcode;
		private string _tbname;
		private string _sortfield;
		private int? _pagesize;
		private int? _editwidth;
		private int? _editheight;
		private string _tbtype;
		private string _selectsql;
		private int? _selecttype;
		private string _insertsql;
		private int? _inserttype;
		private string _updatesql;
		private int? _updatetype;
		private string _deletesql;
		private int? _deletetype;
		private string _remark;
		private DateTime? _createtime= DateTime.Now;
		/// <summary>
		/// 
		/// </summary>
		public decimal ID
		{
			set{ _id=value;}
			get{return _id;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string DBNAME
		{
			set{ _dbname=value;}
			get{return _dbname;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string TBCODE
		{
			set{ _tbcode=value;}
			get{return _tbcode;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string TBNAME
		{
			set{ _tbname=value;}
			get{return _tbname;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string SORTFIELD
		{
			set{ _sortfield=value;}
			get{return _sortfield;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? PAGESIZE
		{
			set{ _pagesize=value;}
			get{return _pagesize;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? EDITWIDTH
		{
			set{ _editwidth=value;}
			get{return _editwidth;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? EDITHEIGHT
		{
			set{ _editheight=value;}
			get{return _editheight;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string TBTYPE
		{
			set{ _tbtype=value;}
			get{return _tbtype;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string SELECTSQL
		{
			set{ _selectsql=value;}
			get{return _selectsql;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? SELECTTYPE
		{
			set{ _selecttype=value;}
			get{return _selecttype;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string INSERTSQL
		{
			set{ _insertsql=value;}
			get{return _insertsql;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? INSERTTYPE
		{
			set{ _inserttype=value;}
			get{return _inserttype;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string UPDATESQL
		{
			set{ _updatesql=value;}
			get{return _updatesql;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? UPDATETYPE
		{
			set{ _updatetype=value;}
			get{return _updatetype;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string DELETESQL
		{
			set{ _deletesql=value;}
			get{return _deletesql;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? DELETETYPE
		{
			set{ _deletetype=value;}
			get{return _deletetype;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string REMARK
		{
			set{ _remark=value;}
			get{return _remark;}
		}
		/// <summary>
		/// 
		/// </summary>
		public DateTime? CREATETIME
		{
			set{ _createtime=value;}
			get{return _createtime;}
		}
		#endregion Model

	}
}

